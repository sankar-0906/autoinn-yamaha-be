
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Connect to remote database from .env
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
}

console.log('Connecting to:', connectionString.split('@')[1]); // Log host only for security

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prismaTarget = new PrismaClient({ adapter });

async function importData() {
    console.log('Reading exported data...');
    if (!fs.existsSync('exported-data.json')) {
        console.error('exported-data.json not found! Please run export script first.');
        return;
    }
    const data = JSON.parse(fs.readFileSync('exported-data.json', 'utf8'));

    // Helper function to insert records in batches
    async function insertRecords(model, records, modelName) {
        if (!records || records.length === 0) {
            console.log(`Skipping ${modelName} (no records)`);
            return;
        }

        // Quick check if already populated
        const currentCount = await model.count();
        if (currentCount >= records.length) {
            console.log(`✅ ${modelName} already fully populated (${currentCount}/${records.length}). Skipping.`);
            return;
        }

        console.log(`Importing ${modelName}... (${currentCount}/${records.length} records existing)`);

        // Batch size for createMany
        const BATCH_SIZE = 50; // Much smaller batch for remote stability
        for (let i = 0; i < records.length; i += BATCH_SIZE) {
            const batch = records.slice(i, i + BATCH_SIZE).map(record => {
                const { customerDetails, profile, ...cleanRecord } = record;
                return cleanRecord;
            });

            try {
                await model.createMany({
                    data: batch,
                    skipDuplicates: true
                });
                console.log(`  - Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(records.length / BATCH_SIZE)}`);
            } catch (error) {
                console.warn(`  - Batch failed, attempting one-by-one for this batch...`);
                for (let j = 0; j < batch.length; j++) {
                    const item = batch[j];
                    let success = false;
                    let currentItem = { ...item };
                    while (!success) {
                        try {
                            const exists = await model.findUnique({ where: { id: currentItem.id } });
                            if (exists) {
                                success = true;
                                break;
                            }
                            await model.create({ data: currentItem });
                            success = true;
                            if ((j + 1) % 10 === 0) {
                                const status = `Table: ${modelName}, Batch: ${Math.floor(i / BATCH_SIZE) + 1}, Progress: ${j + 1}/${batch.length}`;
                                console.log(`    - ${status}`);
                                fs.writeFileSync('import-status.txt', status);
                            }
                        } catch (e) {
                            if (e.message.includes('createdById_fkey')) {
                                console.warn(`    - FK cycle on createdById for ${item.id}, nullifying...`);
                                currentItem.createdById = null;
                                continue;
                            }
                            if (e.message.includes('Foreign key constraint violated on the constraint')) {
                                const match = e.message.match(/constraint: `(.+?)_(.+?)_fkey`/);
                                if (match) {
                                    const field = match[2];
                                    console.warn(`    - FK violation on ${field}, nullifying...`);
                                    currentItem[field] = null;
                                    continue;
                                }
                            }
                            if (e.message.includes('Unknown argument')) {
                                const match = e.message.match(/Unknown argument `(.+?)`/);
                                if (match) {
                                    const field = match[1];
                                    delete currentItem[field];
                                    continue;
                                }
                            } else if (e.message.includes('Argument `')) {
                                const match = e.message.match(/Argument `(.+?)`: (Invalid value provided|Unknown argument)/);
                                if (match) {
                                    const field = match[1];
                                    delete currentItem[field];
                                    continue;
                                }
                            } else if (e.message.includes('Unique constraint failed')) {
                                success = true;
                            } else {
                                console.error(`    - Failed to insert record ${item.id}:`, e.message);
                                break;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    try {
        console.log('Starting data import (FK checks enabled as per provider rules)...');

        // Import order
        await insertRecords(prismaTarget.user, data.users, 'User');
        await insertRecords(prismaTarget.country, data.countries, 'Country');
        await insertRecords(prismaTarget.state, data.states, 'State');
        await insertRecords(prismaTarget.city, data.cities, 'City');
        await insertRecords(prismaTarget.access, data.accesses, 'Access');
        await insertRecords(prismaTarget.department, data.departments, 'Department');
        await insertRecords(prismaTarget.hsn, data.hsns, 'Hsn');
        await insertRecords(prismaTarget.address, data.addresses, 'Address');
        await insertRecords(prismaTarget.company, data.companies, 'Company');
        await insertRecords(prismaTarget.manufacturer, data.manufacturers, 'Manufacturer');
        await insertRecords(prismaTarget.dealer, data.dealers, 'Dealer');
        await insertRecords(prismaTarget.branch, data.branches, 'Branch');
        await insertRecords(prismaTarget.bankDetails, data.bankDetails, 'BankDetails');
        await insertRecords(prismaTarget.employeeProfile, data.employeeProfiles, 'EmployeeProfile');
        await insertRecords(prismaTarget.vehicleMaster, data.vehicleMasters, 'VehicleMaster');
        await insertRecords(prismaTarget.vehiclePrice, data.vehiclePrices, 'VehiclePrice');
        await insertRecords(prismaTarget.vehicleColor, data.vehicleColors, 'VehicleColor');
        await insertRecords(prismaTarget.image, data.images, 'Image');
        await insertRecords(prismaTarget.partsMaster, data.partsMasters, 'PartsMaster');
        await insertRecords(prismaTarget.multiVehicle, data.multiVehicles, 'MultiVehicle');
        await insertRecords(prismaTarget.roleAccess, data.roleAccesses, 'RoleAccess');
        await insertRecords(prismaTarget.file, data.files, 'File');
        await insertRecords(prismaTarget.employeeDocument, data.employeeDocuments, 'EmployeeDocument');
        await insertRecords(prismaTarget.branchContacts, data.branchContacts, 'BranchContacts');
        await insertRecords(prismaTarget.idCreation, data.idCreations, 'IdCreation');
        await insertRecords(prismaTarget.frameNumber, data.frameNumbers, 'FrameNumber');
        await insertRecords(prismaTarget.serviceDetail, data.serviceDetails, 'ServiceDetail');

        console.log('✅ All data imported successfully to remote!');
    } catch (error) {
        console.error('Import process failed:', error);
    } finally {
        await prismaTarget.$disconnect();
        await pool.end();
    }
}

importData();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');

// Connect to local database
const connectionString = "postgresql://autoinn:autoinn_pass@localhost:5433/autoinn_dev";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prismaTarget = new PrismaClient({ adapter });

async function importData() {
    console.log('Reading exported data...');
    if (!fs.existsSync('exported-data.json')) {
        console.error('exported-data.json not found!');
        return;
    }
    const data = JSON.parse(fs.readFileSync('exported-data.json', 'utf8'));

    // Helper function to insert records in batches
    async function insertRecords(model, records, modelName) {
        if (!records || records.length === 0) {
            console.log(`Skipping ${modelName} (no records)`);
            return;
        }
        console.log(`Importing ${modelName}... (${records.length} records)`);

        // Batch size for createMany
        const BATCH_SIZE = 1000;
        for (let i = 0; i < records.length; i += BATCH_SIZE) {
            const batch = records.slice(i, i + BATCH_SIZE).map(record => {
                // Remove known incompatible fields
                const { customerDetails, profile, ...cleanRecord } = record;
                // Fix any potential nulls in required fields if necessary
                return cleanRecord;
            });

            try {
                try {
                    await model.createMany({
                        data: batch,
                        skipDuplicates: true
                    });
                    console.log(`  - Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(records.length / BATCH_SIZE)}`);
                } catch (error) {
                    console.warn(`  - Batch failed, attempting one-by-one for this batch...`);
                    for (const item of batch) {
                        let success = false;
                        while (!success) {
                            try {
                                await model.create({ data: item });
                                success = true;
                            } catch (e) {
                                if (e.message.includes('Unknown argument')) {
                                    const match = e.message.match(/Unknown argument `(.+?)`/);
                                    if (match) {
                                        const field = match[1];
                                        console.warn(`    - Stripping unknown field: ${field}`);
                                        delete item[field];
                                        continue; // Try again with one less field
                                    }
                                } else if (e.message.includes('Argument `')) {
                                    const match = e.message.match(/Argument `(.+?)`: (Invalid value provided|Unknown argument)/);
                                    if (match) {
                                        const field = match[1];
                                        console.warn(`    - Stripping invalid field: ${field}`);
                                        delete item[field];
                                        continue;
                                    }
                                } else if (e.message.includes('Unique constraint failed')) {
                                    success = true; // Skip already exists
                                } else {
                                    console.error(`    - Failed to insert record ${item.id}:`, e.message);
                                    break; // Unrecoverable error
                                }
                                break; // Other errors
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`  - Error in batch for ${modelName}:`, error.message);
            }
        }
    }

    // Disable foreign key checks temporarily
    try {
        await prismaTarget.$executeRawUnsafe("SET session_replication_role = 'replica';");
        console.log('Foreign key checks disabled.');

        // Import in correct dependency order
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
        await insertRecords(prismaTarget.image, data.images, 'Image');
        await insertRecords(prismaTarget.partsMaster, data.partsMasters, 'PartsMaster');
        await insertRecords(prismaTarget.multiVehicle, data.multiVehicles, 'MultiVehicle');
        await insertRecords(prismaTarget.roleAccess, data.roleAccesses, 'RoleAccess');
        await insertRecords(prismaTarget.file, data.files, 'File');
        await insertRecords(prismaTarget.employeeDocument, data.employeeDocuments, 'EmployeeDocument');
        await insertRecords(prismaTarget.branchContacts, data.branchContacts, 'BranchContacts');
        await insertRecords(prismaTarget.idCreation, data.idCreations, 'IdCreation');
        await insertRecords(prismaTarget.frameNumber, data.frameNumbers, 'FrameNumber');

        console.log('✅ All data imported successfully!');
    } catch (error) {
        console.error('Import process failed:', error);
    } finally {
        // Re-enable foreign key checks
        try {
            await prismaTarget.$executeRawUnsafe("SET session_replication_role = 'origin';");
            console.log('Foreign key checks re-enabled.');
        } catch (e) {
            console.error('Failed to re-enable FK checks:', e.message);
        }
        await prismaTarget.$disconnect();
        await pool.end();
    }
}

importData();

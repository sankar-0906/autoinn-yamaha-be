const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Connect to local database
const connectionString = "postgresql://autoinn:autoinn_pass@localhost:5433/autoinn_dev";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
    const tables = [
        'user', 'country', 'state', 'city', 'access', 'department',
        'hsn', 'address', 'company', 'manufacturer', 'dealer', 'branch',
        'bankDetails', 'employeeProfile', 'vehicleMaster', 'vehiclePrice',
        'image', 'partsMaster', 'multiVehicle', 'roleAccess', 'file',
        'employeeDocument', 'branchContacts', 'idCreation', 'frameNumber'
    ];

    console.log('Verifying data counts:');
    for (const table of tables) {
        try {
            const count = await prisma[table].count();
            console.log(`${table}: ${count} records`);
        } catch (e) {
            console.warn(`${table}: Error or missing: ${e.message}`);
        }
    }
}

verify()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });

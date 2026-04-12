const { Pool } = require('pg');
const fs = require('fs');

const connectionString = "postgresql://doadmin:USnMK5te7DV4pCCL@db-postgresql-blr1-76027-do-user-6868369-0.b.db.ondigitalocean.com:25060/autoinn?sslmode=require";

async function exportData() {
    console.log('Starting POWER export from DigitalOcean...');

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    const rawData = {};
    const tables = [
        'User', 'Country', 'State', 'City', 'Access', 'Department', 'Hsn', 'Address',
        'Company', 'Manufacturer', 'Dealer', 'Branch', 'BankDetails',
        'EmployeeProfile', 'VehicleMaster', 'VehiclePrice', 'Image',
        'PartsMaster', 'MultiVehicle', 'RoleAccess', 'File',
        'EmployeeDocument', 'BranchContacts', 'idCreation', 'FrameNumber',
        '_DepartmentHasRoleAccess' // Helper for mapping
    ];

    for (const table of tables) {
        try {
            const res = await pool.query(`SELECT * FROM "default$default"."${table}"`);
            rawData[table] = res.rows;
            console.log(`Read ${table}: ${res.rows.length} rows`);
        } catch (e) {
            console.warn(`Skip ${table}: ${e.message}`);
        }
    }

    console.log('Mapping relations for Prisma 7...');

    const users = (rawData['User'] || []).map(row => {
        const d = { ...row };
        if (d.createdBy) { d.createdById = d.createdBy; delete d.createdBy; }
        // User in Prisma 1 had 'profile' which is the ID of EmployeeProfile
        return d;
    });

    const employeeProfiles = (rawData['EmployeeProfile'] || []).map(profile => {
        const d = { ...profile };
        // Find User that points to this profile
        const user = users.find(u => u.profile === d.id);
        if (user) {
            d.userId = user.id;
        }
        if (d.createdBy) { d.createdById = d.createdBy; delete d.createdBy; }
        if (d.address) { d.addressId = d.address; delete d.address; }
        if (d.bankDetails) { d.bankDetailsId = d.bankDetails; delete d.bankDetails; }
        if (d.department) { d.departmentId = d.department; delete d.department; }
        return d;
    }).filter(p => p.userId); // Prisma 7 requires userId

    const roleAccesses = (rawData['RoleAccess'] || []).map(ra => {
        const d = { ...ra };
        if (d.access) { d.accessId = d.access; delete d.access; }
        // Get department from join table
        const join = (rawData['_DepartmentHasRoleAccess'] || []).find(j => j.B === d.id);
        if (join) {
            d.departmentId = join.A;
        }
        return d;
    });

    // Simplified data structure matching the import script keys
    const data = {
        users,
        countries: (rawData['Country'] || []).map(r => r),
        states: (rawData['State'] || []).map(r => {
            const d = { ...r, countryId: r.country };
            delete d.country;
            return d;
        }),
        cities: (rawData['City'] || []).map(r => {
            const d = { ...r, stateId: r.state };
            delete d.state;
            return d;
        }),
        accesses: (rawData['Access'] || []),
        departments: (rawData['Department'] || []).map(r => ({ ...r, createdById: r.createdBy })),
        hsns: (rawData['Hsn'] || []).map(r => ({ ...r, createdById: r.createdBy })),
        addresses: (rawData['Address'] || []).map(r => {
            const d = { ...r, cityId: r.district || r.city, stateId: r.state, countryId: r.country, createdById: r.createdBy };
            delete d.district; delete d.city; delete d.state; delete d.country;
            return d;
        }),
        companies: (rawData['Company'] || []).map(r => {
            const d = { ...r, addressId: r.address, createdById: r.createdBy };
            delete d.address;
            return d;
        }),
        manufacturers: (rawData['Manufacturer'] || []).map(r => {
            const d = { ...r, addressId: r.address, createdById: r.createdBy };
            delete d.address;
            return d;
        }),
        dealers: (rawData['Dealer'] || []),
        branches: (rawData['Branch'] || []).map(r => {
            const d = { ...r, addressId: r.address, companyId: r.company, createdById: r.createdBy };
            delete d.address; delete d.company;
            return d;
        }),
        bankDetails: (rawData['BankDetails'] || []).map(r => ({ ...r, createdById: r.createdBy })),
        employeeProfiles,
        vehicleMasters: (rawData['VehicleMaster'] || []).map(r => {
            const d = { ...r, manufacturerId: r.manufacturer, createdById: r.createdBy };
            delete d.manufacturer;
            return d;
        }),
        vehiclePrices: (rawData['VehiclePrice'] || []).map(r => {
            const d = { ...r, vehicleMasterId: r.vehicleMaster, createdById: r.createdBy };
            delete d.vehicleMaster;
            return d;
        }),
        images: (rawData['Image'] || []).map(r => {
            const d = { ...r, vehicleMasterId: r.vehicleMaster, createdById: r.createdBy };
            delete d.vehicleMaster;
            return d;
        }),
        partsMasters: (rawData['PartsMaster'] || []).map(r => {
            const d = { ...r, hsnId: r.hsn, manufacturerId: r.manufacturer, createdById: r.createdBy };
            delete d.hsn; delete d.manufacturer;
            return d;
        }),
        multiVehicles: (rawData['MultiVehicle'] || []).map(r => {
            const d = { ...r, vehicleId: r.vehicle, partsMasterId: r.partsMaster, createdById: r.createdBy };
            delete d.vehicle; delete d.partsMaster;
            return d;
        }),
        roleAccesses,
        files: (rawData['File'] || []).map(r => ({ ...r, createdById: r.createdBy })),
        employeeDocuments: (rawData['EmployeeDocument'] || []).map(r => {
            const d = { ...r, userProfileId: r.userProfile, filesId: r.files, createdById: r.createdBy };
            delete d.userProfile; delete d.files;
            return d;
        }),
        branchContacts: (rawData['BranchContacts'] || []),
        idCreations: (rawData['idCreation'] || []).map(r => {
            const d = { ...r, branchId: r.branch, createdById: r.createdBy };
            delete d.branch;
            return d;
        }),
        frameNumbers: (rawData['FrameNumber'] || []).map(r => {
            const d = { ...r, manufacturerId: r.manufacturer, createdById: r.createdBy };
            delete d.manufacturer;
            return d;
        }),
    };

    // Convert floats
    Object.keys(data).forEach(key => {
        data[key] = data[key].map(row => {
            const newRow = { ...row };
            for (const [col, val] of Object.entries(newRow)) {
                if (typeof val === 'string' && /^-?\d+\.\d{5,}$/.test(val)) {
                    newRow[col] = parseFloat(val);
                }
            }
            return newRow;
        });
    });

    fs.writeFileSync('exported-data.json', JSON.stringify(data, null, 2));
    console.log('✅ Power export complete!');

    await pool.end();
}

exportData().catch(console.error);

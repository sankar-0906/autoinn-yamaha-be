const { Pool } = require('pg');
const fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
        'Company', 'Manufacturer', 'SubDealer', 'Branch', 'BankDetails',
        'EmployeeProfile', 'VehicleMaster', 'VehiclePrice', 'Image',
        'PartsMaster', 'MultiVehicle', 'RoleAccess', 'File',
        'EmployeeDocument', 'BranchContacts', 'idCreation', 'FrameNumber',
        'Supplier', 'SupplierContact', 'Service', '_VehicleMasterHasService',
        'VehicleColor', '_VehicleMasterHasImage', '_VehicleMasterHasFile',
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

    const mapRow = (row) => {
        const d = { ...row };
        if (d.createdBy) { d.createdById = d.createdBy; delete d.createdBy; }
        if (d.updatedBy) { delete d.updatedBy; }
        if (d.deletedBy) { delete d.deletedBy; }

        // Remove Prisma 1 specific relation fields that are now IDs
        // This is a heuristic: if a field exists and there's a corresponding 'Id' field in Prisma 2,
        // we might need to remap it. Most are already handled below.
        return d;
    };

    const users = (rawData['User'] || []).map(row => {
        const d = mapRow(row);
        // Prisma 1 User has 'profile' which is the ID of EmployeeProfile
        // In Prisma 2, EmployeeProfile has 'userId' pointing to User
        return d;
    });

    const employeeProfiles = (rawData['EmployeeProfile'] || []).map(profile => {
        const d = mapRow(profile);
        // Find User that points to this profile
        const user = (rawData['User'] || []).find(u => u.profile === d.id);
        if (user) {
            d.userId = user.id;
        }
        if (d.address) { d.addressId = d.address; delete d.address; }
        if (d.bankDetails) { d.bankDetailsId = d.bankDetails; delete d.bankDetails; }
        if (d.department) { d.departmentId = d.department; delete d.department; }
        return d;
    }).filter(p => p.userId); // Prisma 2 requires userId

    const roleAccesses = (rawData['RoleAccess'] || []).map(ra => {
        const d = mapRow(ra);
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
        countries: (rawData['Country'] || []).map(r => mapRow(r)),
        states: (rawData['State'] || []).map(r => {
            const d = mapRow(r);
            d.countryId = r.country;
            delete d.country;
            return d;
        }),
        cities: (rawData['City'] || []).map(r => {
            const d = mapRow(r);
            d.stateId = r.state;
            delete d.state;
            return d;
        }),
        accesses: (rawData['Access'] || []).map(r => mapRow(r)),
        departments: (rawData['Department'] || []).map(r => mapRow(r)),
        hsns: (rawData['Hsn'] || []).map(r => mapRow(r)),
        addresses: (rawData['Address'] || []).map(r => {
            const d = mapRow(r);
            d.cityId = r.district || r.city;
            d.stateId = r.state;
            d.countryId = r.country;
            delete d.district; delete d.city; delete d.state; delete d.country;
            return d;
        }),
        companies: (rawData['Company'] || []).map(r => {
            const d = mapRow(r);
            d.addressId = r.address;
            delete d.address;
            return d;
        }),
        manufacturers: (rawData['Manufacturer'] || []).map(r => {
            const d = mapRow(r);
            d.addressId = r.address;
            delete d.address;
            return d;
        }),
        dealers: (rawData['SubDealer'] || []).map(r => {
            const d = mapRow(r);
            d.addressId = r.address;
            d.shippingAddressId = r.shippingAddress;
            delete d.address; delete d.shippingAddress;
            return d;
        }),
        branches: (rawData['Branch'] || []).map(r => {
            const d = mapRow(r);
            d.addressId = r.address;
            d.companyId = r.company;
            delete d.address; delete d.company;
            return d;
        }),
        bankDetails: (rawData['BankDetails'] || []).map(r => mapRow(r)),
        employeeProfiles,
        vehicleMasters: (rawData['VehicleMaster'] || []).map(r => {
            const d = mapRow(r);
            d.manufacturerId = r.manufacturer;
            d.hsnId = r.hsn;
            delete d.manufacturer; delete d.hsn;
            return d;
        }),
        vehiclePrices: (rawData['VehiclePrice'] || []).map(r => {
            const d = mapRow(r);
            d.vehicleMasterId = r.vehicleModel;
            delete d.vehicleModel;
            return d;
        }),
        images: (rawData['Image'] || []).map(r => {
            const d = mapRow(r);
            // Join table: A is Image ID, B is VehicleMaster ID
            const join = (rawData['_VehicleMasterHasImage'] || []).find(j => j.A === d.id);
            if (join) d.vehicleMasterId = join.B;
            return d;
        }),
        partsMasters: (rawData['PartsMaster'] || []).map(r => {
            const d = mapRow(r);
            d.hsnId = r.hsn;
            d.manufacturerId = r.manufacturer;
            delete d.hsn; delete d.manufacturer;
            return d;
        }),
        multiVehicles: (rawData['MultiVehicle'] || []).map(r => {
            const d = mapRow(r);
            d.vehicleId = r.vehicle;
            d.partsMasterId = r.partsMaster;
            delete d.vehicle; delete d.partsMaster;
            return d;
        }),
        roleAccesses,
        files: (rawData['File'] || []).map(r => {
            const d = mapRow(r);
            // Join table: A is File ID, B is VehicleMaster ID
            const join = (rawData['_VehicleMasterHasFile'] || []).find(j => j.A === d.id);
            if (join) d.vehicleMasterId = join.B;
            return d;
        }),
        employeeDocuments: (rawData['EmployeeDocument'] || []).map(r => {
            const d = mapRow(r);
            d.userProfileId = r.userProfile;
            d.filesId = r.files;
            delete d.userProfile; delete d.files;
            return d;
        }),
        branchContacts: (rawData['BranchContacts'] || []).map(r => {
            const d = mapRow(r);
            d.branchId = r.branch;
            delete d.branch;
            return d;
        }),
        idCreations: (rawData['idCreation'] || []).map(r => {
            const d = mapRow(r);
            d.branchId = r.branch;
            delete d.branch;
            return d;
        }),
        frameNumbers: (rawData['FrameNumber'] || []).map(r => {
            const d = mapRow(r);
            d.manufacturerId = r.manufacturer;
            delete d.manufacturer;
            return d;
        }),
        suppliers: (rawData['Supplier'] || []).map(r => {
            const d = mapRow(r);
            d.addressId = r.address;
            d.shippingAddressId = r.shippingAddress;
            delete d.address; delete d.shippingAddress;
            return d;
        }),
        supplierContacts: (rawData['SupplierContact'] || []).map(r => {
            const d = mapRow(r);
            d.supplierId = r.supplier;
            delete d.supplier;
            return d;
        }),
        serviceDetails: (rawData['Service'] || []).map(r => {
            const d = mapRow(r);
            // Join table: A is Service ID, B is VehicleMaster ID
            const join = (rawData['_VehicleMasterHasService'] || []).find(j => j.A === d.id);
            if (join) {
                d.vehicleMasterId = join.B;
            }
            return d;
        }),
        vehicleColors: (rawData['VehicleColor'] || []).map(r => {
            const d = mapRow(r);
            d.vehiclePriceId = r.vehiclePrice;
            delete d.vehiclePrice;
            return d;
        }),
    };

    // Convert floats and sanitize
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

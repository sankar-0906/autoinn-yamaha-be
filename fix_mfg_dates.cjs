const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function decodeChassisNo(chassisNo, manufacturerId) {
    if (!chassisNo || chassisNo.length < 10 || !manufacturerId) return null;

    const monthChar = chassisNo.charAt(8).toUpperCase(); // Position 9
    const yearChar = chassisNo.charAt(9).toUpperCase();  // Position 10

    const [monthRecord, yearRecord] = await Promise.all([
        prisma.frameNumber.findFirst({
            where: {
                manufacturerId,
                position: 9,
                inputValue: monthChar
            }
        }),
        prisma.frameNumber.findFirst({
            where: {
                manufacturerId,
                position: 10,
                inputValue: yearChar
            }
        })
    ]);

    if (yearRecord && yearRecord.targetValue) {
        const year = parseInt(yearRecord.targetValue);
        let month = 0; // Default to January

        if (monthRecord && monthRecord.targetValue) {
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const monthIdx = months.indexOf(monthRecord.targetValue.toUpperCase());
            if (monthIdx !== -1) {
                month = monthIdx;
            }
        }

        return new Date(year, month, 1);
    }

    return null;
}

async function fix() {
    console.log('Fetching vehicles without MFG dates...');
    const vehicles = await prisma.individualVehicle.findMany({
        where: { mfgDate: null },
        include: {
            lineItem: {
                include: {
                    inward: true
                }
            }
        }
    });

    console.log(`Found ${vehicles.length} vehicles to update.`);
    let count = 0;

    for (const v of vehicles) {
        if (!v.chassisNo) continue;

        // Use Yamaha ID as default if not specified in inward
        const manufacturerId = v.lineItem?.inward?.manufacturerId || 'ck8g6k0a249el0880cmkbpizm';

        const decodedDate = await decodeChassisNo(v.chassisNo, manufacturerId);

        if (decodedDate) {
            await prisma.individualVehicle.update({
                where: { id: v.id },
                data: { mfgDate: decodedDate }
            });
            count++;
            console.log(`Updated Chassis ${v.chassisNo} with date ${decodedDate.toISOString()}`);
        } else {
            console.warn(`Could not decode date for Chassis ${v.chassisNo}`);
        }
    }

    console.log(`Successfully updated ${count} vehicles.`);
    await prisma.$disconnect();
}

fix();

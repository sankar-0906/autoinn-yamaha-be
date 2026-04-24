import prisma from "./src/utils/prisma.js";

async function fixInventory() {
    console.log("--- Starting Inventory Fix ---");

    // 1. Create or ensure Dealer exists
    const dealerName = "PACER MOTORS PVT LTD";
    let dealer = await prisma.dealer.findFirst({
        where: { name: { contains: "PACER", mode: 'insensitive' } }
    });

    if (!dealer) {
        console.log(`Creating dealer: ${dealerName}`);
        dealer = await prisma.dealer.create({
            data: {
                name: dealerName,
                status: 'ACTIVE',
                address: {
                    create: {
                        line1: 'Yamaha Dealer Address',
                        locality: 'Default',
                        pincode: '560001'
                    }
                }
            }
        });
    }

    // 2. Backfill MFG Dates from Chassis or Inward Date
    console.log("Backfilling MFG Dates...");
    const vehicles = await prisma.individualVehicle.findMany({
        where: { mfgDate: null },
        include: {
            lineItem: {
                include: { inward: true }
            }
        }
    });

    const yearMap = {
        'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019, 'L': 2020,
        'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024, 'S': 2025, 'T': 2026
    };

    let count = 0;
    for (const v of vehicles) {
        let mfgDate = null;

        // Try chassis decoding
        if (v.chassisNo && v.chassisNo.length >= 10) {
            const yearCode = v.chassisNo.charAt(9);
            const year = yearMap[yearCode];
            if (year) {
                mfgDate = new Date(year, 0, 1);
            }
        }

        // Fallback to inward record date if chassis decode failed
        if (!mfgDate && v.lineItem?.inward?.date) {
            mfgDate = new Date(v.lineItem.inward.date);
        }

        if (mfgDate) {
            await prisma.individualVehicle.update({
                where: { id: v.id },
                data: { mfgDate }
            });
            count++;
        }
    }
    console.log(`Updated ${count} vehicles with Mfg Date.`);

    console.log("--- Fix Complete ---");
}

fixInventory().catch(console.error).finally(() => prisma.$disconnect());

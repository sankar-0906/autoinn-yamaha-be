import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const hsnData = [
    { code: "48239030", description: null, cgst: 9, sgst: 9, igst: 18, cess: 0 },
    { code: "84139200", description: null, cgst: 9, sgst: 9, igst: 18, cess: 0 },
    { code: "40169912", description: null, cgst: 9, sgst: 9, igst: 18, cess: 0 },
    { code: "85059000", description: null, cgst: 9, sgst: 9, igst: 18, cess: 0 },
    { code: "87149990", description: null, cgst: 9, sgst: 9, igst: 18, cess: 0 },
    { code: "87149100", description: null, cgst: 9, sgst: 9, igst: 18, cess: 0 },
    { code: "62019990", description: null, cgst: 9, sgst: 9, igst: 18, cess: 0 },
    { code: "61103010", description: null, cgst: 9, sgst: 9, igst: 18, cess: 0 },
    { code: "61052010", description: null, cgst: 9, sgst: 9, igst: 18, cess: 0 },
    { code: "61099020", description: null, cgst: 9, sgst: 9, igst: 18, cess: 0 }
];

async function main() {
    console.log('Seeding HSN data...');

    for (const item of hsnData) {
        await prisma.hsn.upsert({
            where: { code: item.code },
            update: item,
            create: item,
        });
    }

    console.log('Successfully seeded 10 HSN records.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });

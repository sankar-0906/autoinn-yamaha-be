import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const departments = await prisma.department.findMany();

    for (const dept of departments) {
        const existing = await prisma.roleAccess.findFirst({
            where: {
                departmentId: dept.id,
                master: 'COMPANYMASTER',
                subModule: 'hsn_code'
            }
        });

        if (!existing) {
            const access = await prisma.access.create({
                data: {
                    read: true,
                    create: true,
                    update: true,
                    delete: true
                }
            });

            await prisma.roleAccess.create({
                data: {
                    departmentId: dept.id,
                    master: 'COMPANYMASTER',
                    subModule: 'hsn_code',
                    accessId: access.id
                }
            });
            console.log(`Added hsn_code access to department: ${dept.role}`);
        } else {
            console.log(`hsn_code access already exists for department: ${dept.role}`);
        }
    }
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

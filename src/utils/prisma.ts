import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export default prisma;



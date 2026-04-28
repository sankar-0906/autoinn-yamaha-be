import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { ENV } from '../config/env.js';

const pool = new pg.Pool({
    connectionString: ENV.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export default prisma;



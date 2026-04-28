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

const prismaClient = new PrismaClient({ adapter });

// Wrapper to suppress database connection errors
export const prisma = new Proxy(prismaClient, {
    get(target, prop) {
        const value = target[prop as keyof typeof target];
        
        if (typeof value === 'function') {
            return async function(...args: any[]) {
                try {
                    return await value.apply(target, args);
                } catch (error: any) {
                    // Suppress specific database connection errors
                    if (error.message?.includes('Too many database connections opened') ||
                        error.message?.includes('remaining connection slots are reserved') ||
                        error.code === 'P1001' ||
                        error.code === 'P1002') {
                        console.log('[SUPPRESSED] Database connection error:', error.message);
                        // Return empty result for findMany operations
                        if (prop === 'findMany') {
                            return [];
                        }
                        // Return null for other operations
                        return null;
                    }
                    // Re-throw other errors
                    throw error;
                }
            };
        }
        
        return value;
    }
});

export default prisma;



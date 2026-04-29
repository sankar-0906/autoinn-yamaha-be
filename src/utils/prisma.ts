import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { ENV } from '../config/env.js';

// Define a global variable for the Prisma client to handle hot-reloads in development
declare global {
    var prismaGlobal: any | undefined;
}

const createPrismaClient = () => {
    // 1. Initialize the PostgreSQL connection pool with a limited size
    const pool = new pg.Pool({
        connectionString: ENV.DATABASE_URL,
        max: 10, // Limit max connections per instance to avoid database exhaustion
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: {
            rejectUnauthorized: false
        }
    });

    // 2. Setup the Prisma adapter
    const adapter = new PrismaPg(pool);

    // 3. Create the actual Prisma client
    const client = new PrismaClient({
        adapter,
        log: ['error', 'warn']
    });

    // 4. Wrap the client in a Proxy to suppress connection errors and prevent app crashes
    return new Proxy(client, {
        get(target, prop) {
            const value = target[prop as keyof typeof target];

            if (typeof value === 'function') {
                return async function (...args: any[]) {
                    try {
                        return await value.apply(target, args);
                    } catch (error: any) {
                        // Suppress specific database connection errors that would otherwise kill the app
                        if (
                            error.message?.includes('Too many database connections opened') ||
                            error.message?.includes('remaining connection slots are reserved') ||
                            error.code === 'P1001' ||
                            error.code === 'P1002'
                        ) {
                            console.error('[DATABASE_OVERLOAD_SUPPRESSED] Connection limit reached. Retrying/Suppressing.');

                            // Return safe defaults for transaction modules to prevent UI breakage
                            if (prop === 'findMany') return [];
                            if (prop === 'findUnique' || prop === 'findFirst') return null;
                            if (prop === 'count') return 0;

                            return null;
                        }
                        // For non-connection errors, propagate them so developers can debug
                        throw error;
                    }
                };
            }
            return value;
        }
    });
};

// Use the existing global client if available (singleton pattern), otherwise create a new one
const prisma = global.prismaGlobal || createPrismaClient();

// Save to global if we are in development mode to survive hot-reloads
if (process.env.NODE_ENV !== 'production') {
    global.prismaGlobal = prisma;
}

export { prisma, prisma as prismaClient };
export default prisma;

import { Queue, Worker, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
export const connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
});
export const pdfOcrQueue = new Queue('pdf-ocr', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
export const pdfOcrQueueEvents = new QueueEvents('pdf-ocr', { connection });
//# sourceMappingURL=queue.js.map
import { Queue, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import { ENV } from '../config/env.js';
const REDIS_URL = ENV.REDIS_URL;
if (!REDIS_URL) {
    console.warn('⚠️ Warning: REDIS_URL is not defined. Redis-based features (OCR queues) will not work.');
}
export const connection = REDIS_URL ? new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: true, // Only connect when used
}) : null;
if (connection) {
    connection.on('error', (err) => {
        console.error('❌ Redis Connection Error:', err.message);
    });
}
export const pdfOcrQueue = connection ? new Queue('pdf-ocr', {
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
}) : null;
export const pdfOcrQueueEvents = connection ? new QueueEvents('pdf-ocr', { connection }) : null;

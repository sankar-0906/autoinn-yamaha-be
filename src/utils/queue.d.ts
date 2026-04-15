import { Queue, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
export declare const connection: Redis;
export declare const pdfOcrQueue: Queue<any, any, string, any, any, string>;
export declare const pdfOcrQueueEvents: QueueEvents;
//# sourceMappingURL=queue.d.ts.map
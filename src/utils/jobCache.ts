import { randomUUID } from 'crypto';

export interface JobStatus {
    status: 'processing' | 'done' | 'error';
    data?: any;
    message?: string;
    createdAt: Date;
}

class JobCacheService {
    private cache = new Map<string, JobStatus>();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Clean up jobs older than 1 hour every 30 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 30 * 60 * 1000);
    }

    createJob(): string {
        const jobId = randomUUID();
        this.cache.set(jobId, {
            status: 'processing',
            createdAt: new Date()
        });
        return jobId;
    }

    setJobComplete(jobId: string, data: any): void {
        const existing = this.cache.get(jobId);
        if (existing) {
            this.cache.set(jobId, {
                status: 'done',
                data,
                createdAt: existing.createdAt
            });
        }
    }

    setJobError(jobId: string, message: string): void {
        const existing = this.cache.get(jobId);
        if (existing) {
            this.cache.set(jobId, {
                status: 'error',
                message,
                createdAt: existing.createdAt
            });
        }
    }

    getJob(jobId: string): JobStatus | null {
        return this.cache.get(jobId) || null;
    }

    private cleanup(): void {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        for (const [jobId, job] of this.cache.entries()) {
            if (job.createdAt < oneHourAgo) {
                this.cache.delete(jobId);
            }
        }
    }

    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}

export const jobCache = new JobCacheService();

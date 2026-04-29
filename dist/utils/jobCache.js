import { randomUUID } from 'crypto';
class JobCacheService {
    constructor() {
        this.cache = new Map();
        // Clean up jobs older than 1 hour every 30 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 30 * 60 * 1000);
    }
    createJob() {
        const jobId = randomUUID();
        this.cache.set(jobId, {
            status: 'processing',
            createdAt: new Date()
        });
        return jobId;
    }
    setJobComplete(jobId, data) {
        const existing = this.cache.get(jobId);
        if (existing) {
            this.cache.set(jobId, {
                status: 'done',
                data,
                createdAt: existing.createdAt
            });
        }
    }
    setJobError(jobId, message) {
        const existing = this.cache.get(jobId);
        if (existing) {
            this.cache.set(jobId, {
                status: 'error',
                message,
                createdAt: existing.createdAt
            });
        }
    }
    getJob(jobId) {
        return this.cache.get(jobId) || null;
    }
    cleanup() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        for (const [jobId, job] of this.cache.entries()) {
            if (job.createdAt < oneHourAgo) {
                this.cache.delete(jobId);
            }
        }
    }
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}
export const jobCache = new JobCacheService();

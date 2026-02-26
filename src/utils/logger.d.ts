/**
 * Simple structured logger for the backend.
 * Uses console under the hood with colored prefixes and ISO timestamps.
 * Can be swapped for Winston/Pino later by changing this file only.
 */
export declare const logger: {
    info(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    http(method: string, path: string, status: number, ms: number): void;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map
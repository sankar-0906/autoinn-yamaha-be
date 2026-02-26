/**
 * Simple structured logger for the backend.
 * Uses console under the hood with colored prefixes and ISO timestamps.
 * Can be swapped for Winston/Pino later by changing this file only.
 */

const colors = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    bold: '\x1b[1m',
};

function timestamp(): string {
    return new Date().toISOString();
}

function formatMessage(level: string, message: string, meta?: any): string {
    const ts = `${colors.dim}[${timestamp()}]${colors.reset}`;
    const metaStr = meta !== undefined
        ? `\n  ${colors.dim}${JSON.stringify(meta, null, 2)}${colors.reset}`
        : '';
    return `${ts} ${level} ${message}${metaStr}`;
}

export const logger = {
    info(message: string, meta?: any) {
        console.log(formatMessage(`${colors.green}INFO ${colors.reset}`, message, meta));
    },
    warn(message: string, meta?: any) {
        console.warn(formatMessage(`${colors.yellow}WARN ${colors.reset}`, message, meta));
    },
    error(message: string, meta?: any) {
        console.error(formatMessage(`${colors.red}ERROR${colors.reset}`, message, meta));
    },
    debug(message: string, meta?: any) {
        if (process.env.LOG_LEVEL === 'debug') {
            console.debug(formatMessage(`${colors.cyan}DEBUG${colors.reset}`, message, meta));
        }
    },
    http(method: string, path: string, status: number, ms: number) {
        const statusColor = status >= 500
            ? colors.red
            : status >= 400
                ? colors.yellow
                : colors.green;
        console.log(
            `${colors.dim}[${timestamp()}]${colors.reset} ${colors.magenta}HTTP ${colors.reset}` +
            `${colors.bold}${method.padEnd(7)}${colors.reset} ` +
            `${path.padEnd(40)} ` +
            `${statusColor}${status}${colors.reset} ` +
            `${colors.dim}${ms}ms${colors.reset}`
        );
    },
};

export default logger;

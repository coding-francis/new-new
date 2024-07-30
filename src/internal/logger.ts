import pino from 'pino';

export interface Logger {
    info(obj: object, msg?: string, ...args: unknown[]): void;
    error(obj: object, msg?: string, ...args: unknown[]): void;
    warn(obj: object, msg?: string, ...args: unknown[]): void;
    debug(obj: object, msg?: string, ...args: unknown[]): void;
}

const logger = pino.default({
    level: 'info',
});

export const appLogger: Logger = {
    info: logger.info.bind(logger),
    error: logger.error.bind(logger),
    warn: logger.warn.bind(logger),
    debug: logger.debug.bind(logger),
};

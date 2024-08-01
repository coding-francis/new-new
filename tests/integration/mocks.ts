import { Logger } from '../../src/internal/logger';
import pino from 'pino';

export function getMockLogger(): [Logger, string[]] {
    const logs: string[] = [];

    const pinoLogger = pino(
        {},
        {
            write: (log: string) => {
                const data = JSON.parse(log.trim());
                delete data.responseTime;
                delete data.time;
                delete data.hostname;
                delete data.pid;

                logs.push(data);
            },
        }
    );

    return [pinoLogger, logs];
}

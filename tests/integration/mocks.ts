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

                //user.id is unpredictable
                if ('user' in data && 'id' in data.user) {
                    delete data.user.id;
                }
                logs.push(data);
            },
        }
    );

    return [pinoLogger, logs];
}

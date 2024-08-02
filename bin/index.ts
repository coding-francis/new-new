import { initializeRestHandlers } from '../src/app/rest/index';
import { initializeDataLayer } from '../src/data';
import PrismaDatabase from '../src/internal/database';
import { appLogger } from '../src/internal/logger';
import FastifyServer from '../src/internal/server';
import { initializeServices } from '../src/services';
import config, { DatabaseConfig } from '../src/config';

const prismaInstance = new PrismaDatabase(DatabaseConfig.DATABASE_URL);

async function main() {
    await prismaInstance.connect();
    const dataLayer = initializeDataLayer(prismaInstance, appLogger);
    const servicesLayer = initializeServices(dataLayer, appLogger);

    const server = new FastifyServer(
        initializeRestHandlers(servicesLayer),
        appLogger
    );
    await server.start(config.port);
}

main().catch(error => {
    appLogger.error(error);
    process.exit(1);
});

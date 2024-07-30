import { initializeRestHandlers } from '../src/app/rest/index';
import { initializeDataLayer } from '../src/data';
import PrismaDatabase from '../src/internal/database';
import { appLogger } from '../src/internal/logger';
import FastifyServer from '../src/internal/server';
import { initializeServices } from '../src/services';

const prismaInstance = new PrismaDatabase('');

async function main() {
    await prismaInstance.connect();
    const dataLayer = initializeDataLayer(prismaInstance, appLogger);
    const servicesLayer = initializeServices(dataLayer, appLogger);

    const server = new FastifyServer(initializeRestHandlers(servicesLayer));
    await server.start(3000);
}

main().catch(error => {
    appLogger.error(error);
    process.exit(1);
});

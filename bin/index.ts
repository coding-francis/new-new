import FastifyServer from '../src/internal/server';
import { initializeRestHandlers } from './app/rest/index';
import { initializeDataLayer } from './data/index';
import PrismaDatabase from './internal/database';
import { appLogger } from './internal/logger';
import { initializeServices } from './services/index';

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

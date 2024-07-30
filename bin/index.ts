import FastifyServer from '../src/internal/server.ts';
import { initializeRestHandlers } from './app/rest/index.ts';
import { initializeDataLayer } from './data/index.ts';
import PrismaDatabase from './internal/database.ts';
import { appLogger } from './internal/logger.ts';
import { initializeServices } from './services/index.ts';

const prismaInstance = new PrismaDatabase('');
await prismaInstance.connect();
const dataLayer = initializeDataLayer(prismaInstance, appLogger);
const servicesLayer = initializeServices(dataLayer, appLogger);

const server = new FastifyServer(initializeRestHandlers(servicesLayer));

server.start(3000);

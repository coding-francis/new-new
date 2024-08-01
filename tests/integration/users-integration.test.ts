import { getMockLogger } from './mocks';
import PrismaDatabase from '../../src/internal/database';
import { DatabaseConfig } from '../../src/config';
import { initializeDataLayer } from '../../src/data';
import { initializeRestHandlers } from '../../src/app/rest';
import { initializeServices } from '../../src/services';
import FastifyServer from '../../src/internal/server';

function seedUserData(db: PrismaDatabase) {
    return {
        up: () =>
            db.interface.user.create({
                data: {
                    email: 'test@test.com',
                    name: 'Test User',
                    password: 'password',
                },
            }),

        down: () => db.interface.user.deleteMany({}),
    };
}

describe('Users endpoint', () => {
    beforeEach(async () => {
        const [logger, logs] = getMockLogger();
        const prismaInstance = new PrismaDatabase(
            DatabaseConfig.TEST_DATABASE_URL
        );
        await prismaInstance.connect();

        const dataLayer = initializeDataLayer(prismaInstance, logger);
        const servicesLayer = initializeServices(dataLayer, logger);
        const server = new FastifyServer(
            initializeRestHandlers(servicesLayer),
            logger
        );

        // Make sure the database is clean
        await seedUserData(prismaInstance).down();

        // Seed the database
        await seedUserData(prismaInstance).up();

        expect.setState({ logs, server, prismaInstance });
    });

    afterEach(async () => {
        const { prismaInstance } = expect.getState();
        await seedUserData(prismaInstance).down();
    });

    test('GET /users:id should return a user', async () => {
        const { server, logs } = expect.getState();

        const response = await server.app.inject({
            method: 'GET',
            url: '/users/1',
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1,
            email: 'test@test.com',
            name: 'Test User',
        });

        expect(logs).toMatchSnapshot();
    });
});

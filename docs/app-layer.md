# APP Layer

The app layer is the `view` or `presentation` of the application. User requests hits the app layer and responses leave the app layer.

App layer can be of different protocols

- Http (Serving html template)
- REST (Using any framework of choice)
- Graphql (Using any engine of choice)
- Websocket - Any engine of choice (Web Socket, socketio, etc)
- RPC - Any engine of choice (JSON RPC, TRPC, GRPC)
- Kafka producers
- Message queues

**NB: A project may contain more than one app layers**

## Adding new App layer

App layer consist of handlers of user requests. For the sake of this doc, let's focus on REST API with `fastify`

The App layer for REST endpoint consist of route handlers.

- In a file, named <feature>-handler.ts, define handler and export default the route handler options

Example of `user-handlers.ts`

```ts
import { Service } from '../../services';
import {
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    RouteHandler,
    RouteOptions,
} from 'fastify';
import {
    BaseServiceLayerError,
    ResourceNotFoundServiceError,
} from '../../services/errors';
import { HttpNotFoundError, HttpServerError } from './exceptions';
import { UserResource } from '../../services/resource';

interface URLParams {
    id: string;
}

//I thought of adding handler to RouteOptions but I felt I needed the handler as  a `controller` function seperated from the metadata. It involves you passing
// the service twice and also typing the handler function twice. I think it's better to have the handler as a function and then pass it to the RouteOptions.
//Always don't export handler functions, export the RouteOptions and the RouteHandler.
function fetchUserByIdHandler(
    srv: Pick<Service, 'UserService'>
): RouteHandler<{ Params: URLParams }> {
    return async (req, res) => {
        try {
            const user = await srv.UserService.getUserById(
                Number(req.params.id)
            );
            req.log.info(`User with id ${req.params.id} fetched`);
            res.status(200).send(user);
        } catch (error) {
            req.log.error(error);
            if (
                error instanceof BaseServiceLayerError &&
                error instanceof ResourceNotFoundServiceError
            ) {
                throw new HttpNotFoundError(error.message, error.data);
            }

            throw new HttpServerError('Internal server error');
        }
    };
}

//Always export the RouteOptions as default.
export default function HandlerRouteOption(
    srv: Pick<Service, 'UserService'>
): RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    { Params: URLParams }
> {
    return {
        handler: fetchUserByIdHandler(srv),
        method: 'GET',
        url: '/users/:id',
        schema: {
            description: 'Fetch user by id',
            tags: ['User'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
            },
            response: {
                200: UserResource.schema,
                404: HttpNotFoundError.schema,
                500: HttpServerError.schema,
            },
        },
    };
}

```

- Route options define the handler and the schema.

## Error handling

- Errors from the service layer should be handled. Errors thrown is service layer should be focused on the framework or protocol being used.

```ts
    req.log.error(error);
    if (
        error instanceof BaseServiceLayerError &&
        error instanceof ResourceNotFoundServiceError
    ) {
        throw new HttpNotFoundError(error.message, error.data);
    }

    throw new HttpServerError('Internal server error');
```

## Initializers

To initialize this route, it needs to be added to the list of the routeOptions list defined in the `initializeRestHandlers` function in `src/app/rest/initialize.ts`.

```ts
import { pick } from 'lodash';
import { Service } from '../../services/index';
import fetchUserByIdRouteOption from './user-handlers';

export function initializeRestHandlers(srv: Service) {
    return [fetchUserByIdRouteOption(pick(srv, 'UserService'))];
}

```

## Writing unite test

To write unite test for app layer is similar to integration test but there are slight differences.

- Service as a dependency should be mocked
- All responses should be tested (2xx,3xx,4xx, 5xx)

```ts
import FastifyServer from '../../internal/server';
import { Service } from '../../services';
import { ResourceNotFoundServiceError } from '../../services/errors';
import { getMockLogger } from '../../utils/testUtils';
import { initializeRestHandlers } from './initialize';

describe('Test user handler', () => {
    beforeEach(() => {
        //Mock service for testing
        const mockedService: Pick<Service, 'UserService'> = {
            UserService: {
                getUserById: jest.fn(),
                createUser: jest.fn(),
            },
        };

        //Initialize server. This is the same as the server in bin/index.ts just that service is mocked.
        // The difference between this and integration test is that we are testing the handler in isolation by mocking the service.
        const [logger] = getMockLogger();
        const server = new FastifyServer(
            initializeRestHandlers(mockedService),
            logger
        );
        expect.setState({ mockedService, server });
    });

    describe('fetchUserByIdHandler', () => {
        test('Should return user and 200 response ', async () => {
            const { mockedService, server } = expect.getState();

            const user = {
                id: 1,
                name: 'John Doe',
            };

            jest.spyOn(
                mockedService.UserService,
                'getUserById'
            ).mockResolvedValue(user);

            const response = await (
                server as FastifyServer<{ Params: unknown }>
            ).app.inject({
                method: 'GET',
                url: '/users/1',
            });

            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual(user);
        });

        test('Should return 404 response ', async () => {
            const { mockedService, server } = expect.getState();

            jest.spyOn(
                mockedService.UserService,
                'getUserById'
            ).mockRejectedValue(
                new ResourceNotFoundServiceError('User not found')
            );

            const response = await (
                server as FastifyServer<{ Params: unknown }>
            ).app.inject({
                method: 'GET',
                url: '/users/1',
            });

            expect(response.statusCode).toBe(404);
        });

        test('Should return 500 response ', async () => {
            const { mockedService, server } = expect.getState();

            jest.spyOn(
                mockedService.UserService,
                'getUserById'
            ).mockRejectedValue(new Error('Internal server error'));

            const response = await (
                server as FastifyServer<{ Params: unknown }>
            ).app.inject({
                method: 'GET',
                url: '/users/1',
            });

            expect(response.statusCode).toBe(500);
        });
    });
});

```

## Writing Integration test

ones an app layer is written, it means the whole Request/Response cycle is completed, therefor there is the need to write integration test.

- Integration test requires a full test of the system.
- Snapshot assertion is needed.
- Mostly focuses on 2xx and 3xx responses
- Written in the directory `tests/integration`

eg. in `tests/integration/users-integration.test.ts`

```ts
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

```

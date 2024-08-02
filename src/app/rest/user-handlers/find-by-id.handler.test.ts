import FastifyServer from '../../../internal/server';
import { Service } from '../../../services';
import { ResourceNotFoundServiceError } from '../../../services/errors';
import fetchUserByIdRouteOptions from './find-by-id.handler';

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
        const server = new FastifyServer(
            [fetchUserByIdRouteOptions(mockedService)],
            true
        );
        expect.setState({ mockedService, server });
    });

    describe('fetchUserByIdHandler', () => {
        test('Should return user and 200 response ', async () => {
            const { mockedService, server } = expect.getState();

            const user = {
                id: 1,
                name: 'John Doe',
                email: 'test@test.com',
            };

            jest.spyOn(
                mockedService.UserService,
                'getUserById'
            ).mockResolvedValue(user);

            const response = await server.app.inject({
                method: 'GET',
                url: '/api/users/1',
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

            const response = await server.app.inject({
                method: 'GET',
                url: '/api/users/1',
            });

            expect(response.statusCode).toBe(404);
        });

        test('Should return 500 response ', async () => {
            const { mockedService, server } = expect.getState();

            jest.spyOn(
                mockedService.UserService,
                'getUserById'
            ).mockRejectedValue(new Error('Internal server error'));

            const response = await server.app.inject({
                method: 'GET',
                url: '/api/users/1',
            });

            expect(response.statusCode).toBe(500);
        });
    });
});

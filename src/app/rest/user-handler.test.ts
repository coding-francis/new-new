import FastifyServer from '../../internal/server';
import { Service } from '../../services';
import { ResourceNotFoundServiceError } from '../../services/errors';
import { initializeRestHandlers } from './initialize';

describe('Test user handler', () => {
    beforeEach(() => {
        const mockedService: Pick<Service, 'UserService'> = {
            UserService: {
                getUserById: jest.fn(),
                createUser: jest.fn(),
            },
        };

        const server = new FastifyServer(initializeRestHandlers(mockedService));
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

import FastifyServer from '../../../internal/server';
import { CreateUserPayload, Service } from '../../../services';
import { DataValidationError } from '../../../services/errors';
import createUserRouteOption from './create-user.handler';

describe('CreateUserHandler', () => {
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
            [createUserRouteOption(mockedService)],
            true
        );
        expect.setState({ mockedService, server });
    });

    test('Should return user and 201 response ', async () => {
        const { mockedService, server } = expect.getState();

        const user = {
            id: 1,
            name: 'John Doe',
            email: 'text@test.com',
        };

        const payload: CreateUserPayload = {
            name: 'John Doe',
            email: 'text@test.com',
            password: 'password123',
        };

        jest.spyOn(mockedService.UserService, 'createUser').mockResolvedValue(
            user
        );

        const response = await server.app.inject({
            method: 'POST',
            url: '/api/users',
            payload,
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual(user);
    });

    test('Should 500 response ', async () => {
        const { mockedService, server } = expect.getState();

        const payload: CreateUserPayload = {
            name: 'John Doe',
            email: 'text@test.com',
            password: 'password123',
        };

        jest.spyOn(mockedService.UserService, 'createUser').mockRejectedValue(
            new Error('Server error')
        );

        const response = await server.app.inject({
            method: 'POST',
            url: '/api/users',
            payload,
        });

        expect(response.statusCode).toBe(500);
    });

    test('Should 400 response ', async () => {
        const { mockedService, server } = expect.getState();

        const payload: CreateUserPayload = {
            name: 'John Doe',
            email: 'text@test.com',
            password: 'password123',
        };

        jest.spyOn(mockedService.UserService, 'createUser').mockRejectedValue(
            new DataValidationError('Invalid data')
        );

        const response = await server.app.inject({
            method: 'POST',
            url: '/api/users',
            payload,
        });

        expect(response.statusCode).toBe(400);
    });
});

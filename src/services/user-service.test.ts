import { DataLayer } from '../data';
import { InvalidInputError, RecordNotFoundError } from '../data/errors';
import { Logger } from '../internal/logger';
import { BaseServiceLayerError, DataValidationError } from './errors';
import { initializeServices } from './initializer';

describe('UserService', () => {
    beforeEach(() => {
        const dataLayer: Pick<DataLayer, 'UserDataLayer'> = {
            UserDataLayer: {
                createUser: jest.fn(),
                getUserById: jest.fn(),
            },
        };

        const logger: Logger = {
            error: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
            child: jest.fn(),
        };

        const services = initializeServices(dataLayer, logger);

        expect.setState({ services, dataLayer, logger });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        test('Should create a user', async () => {
            ///Arrange
            const { services, dataLayer } = expect.getState();

            const email = 'example@test.com';
            const name = 'John Doe';
            const id = 1;
            const password = '2232312323';

            const expectedUser = {
                email,
                id,
                name,
            };

            jest.spyOn(
                (dataLayer as DataLayer).UserDataLayer,
                'createUser'
            ).mockResolvedValueOnce({
                id,
                name,
                email,
                password,
            });

            ///Act
            const user = await services.UserService.createUser({
                email,
                name,
                password,
            });

            expect(user.toJSON()).toEqual(expectedUser);
        });

        test('Should throw `BaseServiceLayerError` when there is validation error', () => {
            //Arrange
            const { services } = expect.getState();

            const email = 'test.com';
            const name = 'John Doe';
            const password = '1234';

            //Act and Assert
            expect(
                services.UserService.createUser({
                    email,
                    name,
                    password,
                })
            ).rejects.toBeInstanceOf(DataValidationError);
            expect(
                services.UserService.createUser({
                    email,
                    name,
                    password,
                })
            ).rejects.toBeInstanceOf(BaseServiceLayerError);
        });

        test('Should throw `BaseServiceLayerError` when DatabaseError is thrown', () => {
            //Arrange
            const { services, dataLayer } = expect.getState();

            const email = 'example@test.com';
            const name = 'John Doe';
            const password = '2232312sowasd0';

            jest.spyOn(
                (dataLayer as DataLayer).UserDataLayer,
                'createUser'
            ).mockRejectedValue(new InvalidInputError('Invalid input'));

            //Act and Assert
            expect(
                services.UserService.createUser({
                    email,
                    name,
                    password,
                })
            ).rejects.toBeInstanceOf(BaseServiceLayerError);
            expect(
                services.UserService.createUser({
                    email,
                    name,
                    password,
                })
            ).rejects.toBeInstanceOf(DataValidationError);
        });
    });

    describe('getUserById', () => {
        test('Should get user by id', async () => {
            //Arrange
            const { services, dataLayer } = expect.getState();

            const email = '';
            const name = 'John Doe';
            const id = 1;

            const expectedUser = {
                email,
                id,
                name,
            };

            jest.spyOn(
                (dataLayer as DataLayer).UserDataLayer,
                'getUserById'
            ).mockResolvedValueOnce({
                id,
                name,
                email,
                password: '123',
            });

            //Act
            const user = await services.UserService.getUserById(id);

            //Assert
            expect(user.toJSON()).toEqual(expectedUser);
        });

        test('Should throw `BaseServiceLayerError` when DatabaseError is thrown', () => {
            //Arrange
            const { services, dataLayer } = expect.getState();

            const id = 1;

            jest.spyOn(
                (dataLayer as DataLayer).UserDataLayer,
                'getUserById'
            ).mockRejectedValue(new RecordNotFoundError('Invalid input'));

            //Act and Assert
            expect(services.UserService.getUserById(id)).rejects.toBeInstanceOf(
                BaseServiceLayerError
            );
        });
    });
});
import { PrismaClient } from '@prisma/client/extension';
import { DataBase } from '../internal/database';
import { Logger } from '../internal/logger';
import UserDataLayer from './user-data-layer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import DatabaseError from './errors/database-basae-error';

describe('Test UserDataLayer', () => {
    beforeEach(() => {
        const db: DataBase<PrismaClient> = {
            interface: {
                user: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 1,
                        name: 'test',
                        email: 'example@gmail.com',
                        password: '123132',
                    }),
                    create: jest.fn().mockResolvedValue({
                        id: 1,
                        name: 'test',
                        email: 'example@gmail.com',
                        password: '123212',
                    }),
                },
            },
            connect: jest.fn(),
            disconnect: jest.fn(),
        };

        const logger: Logger = {
            error: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        };
        const userDataLayer = new UserDataLayer(db, logger);

        expect.setState({ userDataLayer });
    });

    test('Should return user information when no error is thrown', async () => {
        const userDataLayer = expect.getState().userDataLayer;

        const user = await userDataLayer.getUserById(1);

        expect(user).toEqual({
            id: 1,
            name: 'test',
            email: 'example@gmail.com',
            password: '123132',
        });
        expect(userDataLayer.db.interface.user.findUnique).toHaveBeenCalledWith(
            { where: { id: 1 } }
        );
    });

    test('Should return error when error is thrown', async () => {
        const userDataLayer = expect.getState().userDataLayer;
        const error = new PrismaClientKnownRequestError(
            'Record does not exist',
            { code: 'P2001', clientVersion: '2.20.0', meta: { target: ['id'] } }
        );
        jest.spyOn(
            userDataLayer.db.interface.user,
            'findUnique'
        ).mockRejectedValue(error);

        expect(userDataLayer.getUserById(1)).rejects.toBeInstanceOf(
            DatabaseError
        );
        expect(userDataLayer.db.interface.user.findUnique).toHaveBeenCalledWith(
            { where: { id: 1 } }
        );
    });

    test('Should return user created information when no error is thrown', async () => {
        const userDataLayer = expect.getState().userDataLayer;

        const user = await userDataLayer.createUser(
            'test',
            'example@gmail.com',
            '123212'
        );

        expect(user).toEqual({
            id: 1,
            name: 'test',
            email: 'example@gmail.com',
            password: '123212',
        });
        expect(userDataLayer.db.interface.user.create).toHaveBeenCalledWith({
            data: {
                name: 'test',
                email: 'example@gmail.com',
                password: '123212',
            },
        });
    });

    test('Should return error when error is thrown', async () => {
        const userDataLayer = expect.getState().userDataLayer;
        const error = new PrismaClientKnownRequestError(
            'Unique constraint violated',
            { code: 'P2002', clientVersion: '2.20.0', meta: { target: ['id'] } }
        );
        jest.spyOn(userDataLayer.db.interface.user, 'create').mockRejectedValue(
            error
        );

        expect(
            userDataLayer.createUser('test', 'example@test.com', '123212')
        ).rejects.toBeInstanceOf(DatabaseError);

        expect(userDataLayer.db.interface.user.create).toHaveBeenCalledWith({
            data: {
                name: 'test',
                email: 'example@test.com',
                password: '123212',
            },
        });
    });
});

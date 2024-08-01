import { PrismaClient } from '@prisma/client/extension';
import { DataBase } from '../internal/database';
import { Logger } from '../internal/logger';
import UserData from './user-data-layer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import DatabaseError from './errors/database-base-error';

describe('Test UserData', () => {
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
            child: jest.fn(),
        };
        const userData = new UserData(db, logger);

        expect.setState({ userData });
    });

    test('Should return user information when no error is thrown', async () => {
        const userData = expect.getState().userData;

        const user = await userData.getUserById(1);

        expect(user).toEqual({
            id: 1,
            name: 'test',
            email: 'example@gmail.com',
            password: '123132',
        });
        expect(userData.db.interface.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    });

    test('Should return error when error is thrown', async () => {
        const userData = expect.getState().userData;
        const error = new PrismaClientKnownRequestError(
            'Record does not exist',
            { code: 'P2001', clientVersion: '2.20.0', meta: { target: ['id'] } }
        );
        jest.spyOn(userData.db.interface.user, 'findUnique').mockRejectedValue(
            error
        );

        expect(userData.getUserById(1)).rejects.toBeInstanceOf(DatabaseError);
        expect(userData.db.interface.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    });

    test('Should return user created information when no error is thrown', async () => {
        const userData = expect.getState().userData;

        const user = await userData.createUser(
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
        expect(userData.db.interface.user.create).toHaveBeenCalledWith({
            data: {
                name: 'test',
                email: 'example@gmail.com',
                password: '123212',
            },
        });
    });

    test('Should return error when error is thrown', async () => {
        const userData = expect.getState().userData;
        const error = new PrismaClientKnownRequestError(
            'Unique constraint violated',
            { code: 'P2002', clientVersion: '2.20.0', meta: { target: ['id'] } }
        );
        jest.spyOn(userData.db.interface.user, 'create').mockRejectedValue(
            error
        );

        expect(
            userData.createUser('test', 'example@test.com', '123212')
        ).rejects.toBeInstanceOf(DatabaseError);

        expect(userData.db.interface.user.create).toHaveBeenCalledWith({
            data: {
                name: 'test',
                email: 'example@test.com',
                password: '123212',
            },
        });
    });
});

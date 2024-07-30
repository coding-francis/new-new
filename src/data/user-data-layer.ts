import { DataBase } from '../internal/database';
import { PrismaClient, User } from '@prisma/client';
import { Logger } from '../internal/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { InternalDbError } from './errors/internal-db-error';
import {
    handlePrismaClientKnownRequestError,
    RecordNotFoundError,
} from './errors';

export interface UserDataLayer {
    getUserById(id: number): Promise<User>;
    createUser(name: string, email: string, password: string): Promise<User>;
}

export default class UserData implements UserDataLayer {
    constructor(
        private readonly db: DataBase<PrismaClient>,
        private readonly logger: Logger
    ) {}

    public async getUserById(id: number) {
        try {
            const user = await this.db.interface.user.findUnique({
                where: { id },
            });
            if (!user) {
                throw new RecordNotFoundError(
                    `User with id ${id} does not exist`
                );
            }

            return user;
        } catch (error) {
            this.logger.error(
                error as object,
                `Error while finding user with id ${id}`
            );
            if (error instanceof PrismaClientKnownRequestError) {
                const err = handlePrismaClientKnownRequestError(error);
                throw err;
            }
            throw new InternalDbError();
        }
    }

    public async createUser(
        name: string,
        email: string,
        password: string
    ): Promise<User> {
        try {
            const user = await this.db.interface.user.create({
                data: { name, email, password },
            });
            return user;
        } catch (error) {
            this.logger.error(error as object, 'Error while creating user');
            if (error instanceof PrismaClientKnownRequestError) {
                const err = handlePrismaClientKnownRequestError(error);
                throw err;
            }
            throw new InternalDbError();
        }
    }
}

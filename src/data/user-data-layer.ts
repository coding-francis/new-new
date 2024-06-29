import { DataBase } from '../internal/database';
import { PrismaClient, User } from '@prisma/client';
import { Logger } from '../internal/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { InternalDbError } from './errors/internal-db-error';
import { handlePrismaClientKnownRequestError } from './errors';

export default class UserDataLayer {
    constructor(
        private readonly db: DataBase<PrismaClient>,
        private readonly logger: Logger
    ) {}

    public async getUserById(id: number) {
        try {
            return await this.db.interface.user.findUnique({ where: { id } });
        } catch (error) {
            this.logger.error('Error while creating user', error as object);
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
            this.logger.error('Error while creating user', error as object);
            if (error instanceof PrismaClientKnownRequestError) {
                const err = handlePrismaClientKnownRequestError(error);
                throw err;
            }
            throw new InternalDbError();
        }
    }
}

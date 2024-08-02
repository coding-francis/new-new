import z from 'zod';
import { DataLayer } from '../data';
import { handleServiceError } from './errors/utils';
import { UserResource } from './resource';
import { Logger } from '../internal/logger';

const createUserZodSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
});

export type CreateUserPayload = z.infer<typeof createUserZodSchema>;

export interface UserServiceLayer {
    createUser(payload: CreateUserPayload): Promise<UserResource>;
    getUserById(id: number): Promise<UserResource>;
}

export class UserService implements UserServiceLayer {
    constructor(
        private readonly dataLayer: Pick<DataLayer, 'UserDataLayer'>,
        private readonly logger: Logger
    ) {}

    public async createUser(payload: CreateUserPayload): Promise<UserResource> {
        try {
            const { email, name, password } =
                createUserZodSchema.parse(payload);
            const user = await this.dataLayer.UserDataLayer.createUser(
                name,
                email,
                password
            );

            return new UserResource(user);
        } catch (error) {
            this.logger.error(
                error as object,
                `Error occurred while creating user in data layer`
            );
            const err = handleServiceError(error as Error);

            throw err;
        }
    }

    public async getUserById(id: number): Promise<UserResource> {
        try {
            const user = await this.dataLayer.UserDataLayer.getUserById(id);
            return new UserResource(user);
        } catch (error) {
            this.logger.error(
                error as object,
                `Error occurred while getting user with id ${id} in data layer`
            );
            const err = handleServiceError(error as Error);
            throw err;
        }
    }
}

import { User } from '@prisma/client';
import { Resource } from '.';

type UserResourceType = {
    id: number;
    name: string | null;
    email: string;
};

export class UserResource implements Resource<UserResourceType> {
    constructor(private readonly user: User) {}

    public toJSON(): UserResourceType {
        return {
            id: Number(this.user.id),
            name: this.user.name,
            email: this.user.email,
        };
    }

    public static readonly schema = {
        $id: 'User',
        title: 'User',
        type: 'object',
        required: ['id', 'email'],
        properties: {
            id: { type: 'number', example: 1, description: 'User ID' },
            name: {
                type: 'string',
                example: 'John Doe',
                description: 'User name',
            },
            email: {
                type: 'string',
                example: 'xxx@xxxx.com',
                description: 'User email',
            },
        },
    };
}

export default UserResource;

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
            id: { type: 'number' },
            name: { type: ['string', 'null'] },
            email: { type: 'string' },
        },
    };
}

export default UserResource;

import { User } from '@prisma/client';
import { Resource } from '.';

export type UserResourceType = {
    id: number;
    name: string | null;
    email: string;
};

export class UserResource implements Resource<UserResourceType> {
    constructor(private readonly user: User) {}

    public toJSON() {
        return {
            id: this.user.id,
            name: this.user.name,
            email: this.user.email,
        };
    }

    public static schema = {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: ['string', 'null'] },
            email: { type: 'string' },
        },
    };
}

export default UserResource;

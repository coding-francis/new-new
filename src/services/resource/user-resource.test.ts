import { User } from '@prisma/client';
import UserResource from './user-resource';

describe('Test user resource', () => {
    it('should return user resource', () => {
        const prismaUser: User = {
            id: 1,
            name: 'John Doe',
            email: 'test@dmail.com',
            password: 'password',
        };

        const userResource = new UserResource(prismaUser);

        expect(userResource.toJSON()).toEqual({
            id: 1,
            name: 'John Doe',
            email: 'test@dmail.com',
        });
    });
});

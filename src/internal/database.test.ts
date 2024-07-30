import { PrismaClient } from '@prisma/client/extension';
import PrismaDatabase, { DataBase } from './database.ts';
describe('PrismaDatabase', () => {
    beforeEach(() => {
        const db: DataBase<PrismaClient> = new PrismaDatabase(
            'postgresql://postgres:testpassword@localhost:5433/testdb'
        );
        expect.setState({ db });
    });

    afterAll(async () => {
        const db = expect.getState().db as PrismaDatabase;
        await db.disconnect();
    });

    test('Connect to in-memory sqlite database', async () => {
        const db = expect.getState().db as PrismaDatabase;
        expect(db.connect()).resolves.toBeUndefined();
    });
});

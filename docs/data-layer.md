# Data Layer

The data layer is responsible for handling data insertion and retrieval from various datastores. It abstracts the logic for reading and writing data sources from the rest of the application.

## Adding a New Data Layer

Data layers are classes whose constructors accept managers that drive data sources.

### Example

```ts
export default class UserDataLayer {
    constructor(
        private readonly db: DataBase<PrismaClient>,
        private readonly logger: Logger
    ) {}

    public async getUserById(id: number): Promise<User | null> {
        try {
            return await this.db.interface.user.findUnique({ where: { id } });
        } catch (error) {
            this.logger.error('Error while fetching user', error as object);
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
```

To make this data layer class functional, it needs to be initialized. This is done in the `src/data/index.ts` file within the `initializeDataLayer` function.

This function is called during application initialization to set up all data layer classes. Additionally, to ensure TypeScript compatibility, you should add it to the `DataLayer` interface.

### Example

```ts
export interface DataLayer {
    UserDataLayer: UserDataLayer;
}

export const initializeDataLayer = (
    db: DataBase<PrismaClient>,
    logger: Logger
): DataLayer => {
    return {
        UserDataLayer: new UserDataLayer(db, logger),
    };
};
```

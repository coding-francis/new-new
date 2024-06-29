import { PrismaClient } from '@prisma/client';

export interface DataBase <T>{
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    interface: T;
}

class PrismaDatabase  implements DataBase<PrismaClient>{
    private prisma: PrismaClient;

    constructor(dbUrl: string) {
        this.prisma = new PrismaClient({
            datasourceUrl: dbUrl,
        });
    }

    public async connect() {
        await this.prisma.$connect();
    }

    public async disconnect() {
        await this.prisma.$disconnect();
    }

    public get interface (): PrismaClient {
        return this.prisma;
    }


}

export default PrismaDatabase;

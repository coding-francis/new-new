const config = {
    appName: process.env.APP_NAME || 'My App',
    port: Number(process.env.APP_PORT) || 8000,
};

export class DatabaseConfig {
    public static readonly DATABASE_URL = process.env.DATABASE_URL;
}

export default config;

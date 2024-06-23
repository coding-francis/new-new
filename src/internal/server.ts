import fastify, { type FastifyInstance, type RouteOptions } from 'fastify';

export interface Server<T> {
    start(port: number): Promise<void>;
    app: T;
}

class FastifyServer implements Server<FastifyInstance> {
    private _app: FastifyInstance;

    constructor(routes: RouteOptions[]) {
        this._app = fastify({
            logger: {
                level: 'info',
            },
        });

        for (const route of routes) {
            this._app.route(route);
        }
    }

    public async start(port: number): Promise<void> {
        await new Promise<boolean>((resolve, reject) => {
            this._app.listen({ port }, (err, address) => {
                if (err) {
                    reject(err);
                }

                this._app.log.info(`Server listening on ${address}`);
                resolve(true);
            });
        });
    }

    public get app(): FastifyInstance {
        return this._app;
    }
}

export default FastifyServer;

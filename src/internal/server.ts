import fastify, {
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    RouteGenericInterface,
    type FastifyInstance,
    type RouteOptions,
} from 'fastify';
import config from '../config/index.ts';
import swagger from '@fastify/swagger';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swaggerUi from '@fastify/swagger-ui';

export interface Server<T> {
    start(port: number): Promise<void>;
    app: T;
}

class FastifyServer<T extends RouteGenericInterface>
    implements Server<FastifyInstance>
{
    private _app: FastifyInstance;

    constructor(
        routes: RouteOptions<
            RawServerDefault,
            RawRequestDefaultExpression,
            RawReplyDefaultExpression,
            T
        >[]
    ) {
        this._app = fastify({
            logger: true,
        });

        this._app.register(cors, {
            origin: '*',
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'Accept',
                'X-Requested-With',
            ],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        });

        this._app.register(helmet, {});

        this._app.register(swagger, {
            openapi: {
                openapi: '3.0.0',
                info: {
                    title: config.appName,
                    version: '1.0.0',
                },
                servers: [
                    {
                        url: 'http://localhost:3000',
                        description: 'Development server',
                    },
                ],
            },
            swagger: {
                host: 'localhost:3000',
                schemes: ['http'],
            },
        });

        this._app.register(swaggerUi, {
            routePrefix: '/docs',
        });

        for (const route of routes) {
            this._app.route(route);
        }
    }

    /**
     * Starts the server on the specified port.
     * @param port - The port number to listen on.
     * @returns A promise that resolves when the server has started successfully.
     */
    public async start(port: number): Promise<void> {
        await this._app.ready();
        this._app.swagger();

        const address = await new Promise<string>((resolve, reject) => {
            this._app.listen({ port }, (err, address) => {
                if (err) {
                    this._app.log.error(err);
                    reject(err);
                }
                resolve(address);
            });
        });

        this._app.log.info(`Server listening on ${address}`);
    }

    /**
     * Gets the FastifyInstance associated with the server.
     * @returns The FastifyInstance object.
     */
    public get app(): FastifyInstance {
        return this._app;
    }
}

export default FastifyServer;

import fastify, {
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    type FastifyInstance,
    type RouteOptions,
} from 'fastify';
import config from '../config';
import swagger from '@fastify/swagger';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swaggerUi from '@fastify/swagger-ui';
import { Logger } from './logger';
import MainAppError from '../utils/exception';

export abstract class HttpBaseError extends MainAppError {
    public status: number;
    public message: string;
    public statusCode: number;
    public data?: object;

    constructor(message: string, name: string, status: number, data?: object) {
        super(message, name, 'AppLayer.REST');
        this.status = status;
        this.message = message;
        this.statusCode = status;
        this.data = data;
    }
}

export interface Server<T> {
    start(port: number): Promise<void>;
    app: T;
}

type CustomRouteOption<B, P> = RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    { Body: B; Params: P }
>;

class FastifyServer<B, P> implements Server<FastifyInstance> {
    private _app: FastifyInstance;

    constructor(routes: CustomRouteOption<B, P>[], logger: Logger | boolean) {
        this._app = fastify({
            logger:
                typeof logger === 'boolean'
                    ? logger
                    : {
                          child: logger.child.bind(logger),
                          debug: logger.debug.bind(logger),
                          error: logger.error.bind(logger),
                          fatal: logger.error.bind(logger),
                          info: logger.info.bind(logger),
                          trace: logger.debug.bind(logger),
                          warn: logger.warn.bind(logger),
                          level: 'info',
                      },
        });

        this.app.setErrorHandler((error, req, res) => {
            req.log.error(error);

            if (error instanceof HttpBaseError) {
                res.status(error.statusCode).send({
                    message: error.message,
                    data: error.data,
                });
            } else {
                res.status(500).send({
                    message: 'Internal server error',
                });
            }
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
                tags: [{ name: 'User', description: 'User related endpoints' }],
                servers: [
                    {
                        url: `http://localhost:${config.port}`,
                        description: 'Development server',
                    },
                ],
            },
            swagger: {
                host: `localhost:${config.port}`,
                schemes: ['http'],
            },
        });

        this._app.register(swaggerUi, {
            routePrefix: '/docs',
        });

        //Register API routes
        for (const route of routes) {
            this._app.register(
                (instance, _, done) => {
                    instance.route(route);
                    done();
                },
                { prefix: '/api' }
            );
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
            this._app.listen({ port, host: '0.0.0.0' }, (err, address) => {
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

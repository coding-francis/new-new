import FastifyServer from '../src/internal/server';

const server = new FastifyServer([
    {
        handler: (_, res) => {
            return res.status(200).send({ status: 'ok' });
        },
        method: 'GET',
        url: '/health',
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                    },
                },
            },
        },
    },
]);

server.start(3000);

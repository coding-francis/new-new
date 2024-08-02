import type { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';

import FastifyServer from './server';
describe('server', () => {
    beforeEach(() => {
        const route: RouteOptions = {
            method: 'GET',
            url: '/health',
            handler: async (_: FastifyRequest, reply: FastifyReply) => {
                return reply.status(200).send({ ok: true });
            },
        };

        const server = new FastifyServer([route], false);
        expect.setState({ server });
    });

    test('Expert server to receive basic GET /health and return ok', async () => {
        const server = expect.getState().server;

        const response = await server.app.inject({
            method: 'GET',
            url: '/api/health',
        });

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({ ok: true });
    });
});

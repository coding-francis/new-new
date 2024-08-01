import { HttpBaseError } from '../../../internal/server';

export class HttpServerError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpServerError', 500, data);
    }

    public static readonly schema = {
        $id: 'HttpServerError',
        type: 'object',
        properties: {
            name: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'number' },
            data: { type: 'object' },
        },
    };
}

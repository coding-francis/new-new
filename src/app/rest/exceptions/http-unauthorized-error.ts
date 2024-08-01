import { HttpBaseError } from '../../../internal/server';

export class HttpUnauthorizedError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpUnauthorizedError', 401, data);
    }

    public static readonly schema = {
        $id: 'HttpUnauthorizedError',
        type: 'object',
        properties: {
            name: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'number' },
            data: { type: 'object' },
        },
    };
}

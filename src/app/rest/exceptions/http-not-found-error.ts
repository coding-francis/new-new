import { HttpBaseError } from '../../../internal/server';

export class HttpNotFoundError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpNotFoundError', 404, data);
    }

    public static readonly schema = {
        $id: 'HttpNotFoundError',
        type: 'object',
        properties: {
            name: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'number' },
            data: { type: 'object' },
        },
    };
}

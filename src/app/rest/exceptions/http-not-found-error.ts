import { HttpBaseError } from '../../../internal/server';

export class HttpNotFoundError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpNotFoundError', 404, data);
    }

    public static readonly schema = {
        $id: 'HttpNotFoundError',
        type: 'object',
        properties: {
            name: { type: 'string', example: 'HttpNotFoundError' },
            message: { type: 'string', example: 'Not found' },
            statusCode: { type: 'number', example: 404 },
            data: { type: 'object' },
        },
    };
}

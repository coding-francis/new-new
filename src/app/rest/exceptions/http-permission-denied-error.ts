import { HttpBaseError } from '../../../internal/server';

export class HttpPermissionDeniedError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpPermissionDeniedError', 403, data);
    }

    public static readonly schema = {
        $id: 'HttpPermissionDeniedError',
        type: 'object',
        properties: {
            name: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'number' },
            data: { type: 'object' },
        },
    };
}

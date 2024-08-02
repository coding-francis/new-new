import { HttpBaseError } from '../../../internal/server';

export class HttpPermissionDeniedError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpPermissionDeniedError', 403, data);
    }

    public static readonly schema = {
        $id: 'HttpPermissionDeniedError',
        type: 'object',
        properties: {
            name: { type: 'string', example: 'HttpPermissionDeniedError' },
            message: { type: 'string', example: 'Permission denied' },
            statusCode: { type: 'number', example: 403 },
            data: { type: 'object' },
        },
    };
}

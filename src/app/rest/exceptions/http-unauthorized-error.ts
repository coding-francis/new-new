import HttpBaseError from './http-base-error';

export class HttpUnauthorizedError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpUnauthorizedError', 401, data);
    }

    public static schema = {
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

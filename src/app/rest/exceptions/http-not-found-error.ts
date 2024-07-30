import HttpBaseError from './http-base-error';

export class HttpNotFoundError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpNotFoundError', 404, data);
    }

    public static schema = {
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

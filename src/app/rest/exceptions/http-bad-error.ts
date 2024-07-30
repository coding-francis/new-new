import HttpBaseError from './http-base-error';

export class HttpBadError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpBadError', 400, data);
    }

    public static schema = {
        $id: 'HttpBadError',
        type: 'object',
        properties: {
            name: { type: 'string', example: 'HttpBadError' },
            message: { type: 'string', example: 'Bad Request' },
            statusCode: { type: 'number', example: 400 },
            data: { type: 'object' },
        },
    };
}

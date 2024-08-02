import { HttpBaseError } from '../../../internal/server';

export class HttpBadError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpBadError', 400, data);
    }

    public static readonly schema = {
        $id: 'HttpBadError',
        type: 'object',
        properties: {
            name: { type: 'string', example: 'HttpBadError' },
            message: { type: 'string', example: 'Bad Request' },
            statusCode: { type: 'number', example: 400 },
            data: { type: 'object', example: { name: ['Field is required'] } },
        },
    };
}

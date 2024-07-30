import HttpBaseError from './http-base-error';

export class HttpServerError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpServerError', 500, data);
    }
}

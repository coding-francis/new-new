import HttpBaseError from './http-base-error';

export class HttpUnauthorizedError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpUnauthorizedError', 401, data);
    }
}

import HttpBaseError from './http-base-error.ts';

export class HttpUnauthorizedError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpUnauthorizedError', 401, data);
    }
}

import HttpBaseError from './http-base-error';

export class HttpNotFoundError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpNotFoundError', 404, data);
    }
}

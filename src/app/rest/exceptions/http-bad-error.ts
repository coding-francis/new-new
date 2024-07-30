import HttpBaseError from './http-base-error.ts';

export class HttpBadError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpBadError', 400, data);
    }
}

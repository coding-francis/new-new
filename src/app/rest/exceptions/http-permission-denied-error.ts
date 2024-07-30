import HttpBaseError from './http-base-error';

export class HttpPermissionDeniedError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpPermissionDeniedError', 403, data);
    }
}

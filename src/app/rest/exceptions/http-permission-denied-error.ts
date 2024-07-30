import HttpBaseError from './http-base-error.ts';

export class HttpPermissionDeniedError extends HttpBaseError {
    constructor(message: string, data?: object) {
        super(message, 'HttpPermissionDeniedError', 403, data);
    }
}

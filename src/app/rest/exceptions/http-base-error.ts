import MainAppError from '../../../utils/exception';

export default abstract class HttpBaseError extends MainAppError {
    public status: number;
    public message: string;
    public statusCode: number;
    public data?: object;

    constructor(message: string, name: string, status: number, data?: object) {
        super(message, name, 'AppLayer.REST');
        this.status = status;
        this.message = message;
        this.statusCode = status;
        this.data = data;
    }
}

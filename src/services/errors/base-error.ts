import MainAppError from '../../utils/exception';

/**
 * Base error class for service layer. All service layer errors should extend this class. This will help in identifying the source of the error and handling them in the app later
 *
 * @abstract
 * @class BaseService
 * @extends {MainAppError}
 * @category Services
 *
 * @example
 * // Example of extending BaseServiceLayerError
 *
 * export class ValidationError extends BaseServiceLayerError {
 *    constructor(message: string) {
 *       super(message, 'ValidationError');
 *   }
 * }
 */
export abstract class BaseServiceLayerError extends MainAppError {
    constructor(
        message: string,
        name: string,
        private readonly _data?: object
    ) {
        super(message, name, 'ServiceLayer');
    }

    public get data() {
        return this._data;
    }
}

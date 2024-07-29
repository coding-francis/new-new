import MainAppError from '../../utils/exception';

/**
 * The base class for all database errors in the application. This will be very helpful in the service layer to catch all database errors and handle them accordingly.
 *
 * @abstract
 * @class DatabaseError
 * @extends {MainAppError}
 *
 * @example
 * class FieldMustBeUniqueError extends DatabaseError {
 *    constructor(message: string = "Field must be unique") {
 *      super(message, 'FieldMustBeUniqueError');
 *  }
 * }
 *
 */
export abstract class DatabaseError extends MainAppError {
    constructor(message: string, name: string) {
        super(message, name, 'DATA_LAYER');
    }
}

export default DatabaseError;

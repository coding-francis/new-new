import DatabaseError from './database-base-error';

/**
 * Error class for record not found errors
 *
 * @extends DatabaseError
 *
 * @example
 * throw new RecordNotFoundError("Record not found")
 */
export class RecordNotFoundError extends DatabaseError {
    constructor(message: string = 'Record not found') {
        super(message, 'RecordNotFoundError');
    }
}

import DatabaseError from './database-base-error';

/**
 * Error class for internal database errors
 *
 * @extends DatabaseError
 *
 * @example
 * throw new InternalDbError("Internal database error")
 */
export class InternalDbError extends DatabaseError {
    constructor(message: string = 'Internal database error') {
        super(message, 'InternalDbError');
    }
}

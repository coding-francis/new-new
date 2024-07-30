import DatabaseError from './database-base-error.ts';

/**
 *  Error class for invalid input errors
 *
 * @extends DatabaseError
 *
 * @example
 * throw new InvalidInputError("Invalid input")
 */
export class InvalidInputError extends DatabaseError {
    constructor(message: string = 'Invalid input') {
        super(message, 'InvalidInputError');
    }
}

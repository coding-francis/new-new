import DatabaseError from './database-basae-error';

/**
 * Error class for fields that must be unique
 *
 * @extends DatabaseError
 *
 * @example
 * throw new FieldMustBeUniqueError("Field must be unique")
 */
export class FieldMustBeUniqueError extends DatabaseError {
    constructor(message: string = 'Field must be unique') {
        super(message, 'FieldMustBeUniqueError');
    }
}
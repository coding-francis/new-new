import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import DatabaseError from './database-base-error.ts';
import { RecordNotFoundError } from './record-not-found.ts';
import { InternalDbError } from './internal-db-error.ts';
import { FieldMustBeUniqueError } from './must-be-unique-error.ts';
import { InvalidInputError } from './invalid-input-error.ts';

function getFieldFromMeta(meta: PrismaClientKnownRequestError['meta']): string {
    let fields = '';
    if (meta && meta['target']) {
        fields = (meta['target'] as string[]).join(', ');
    }
    return fields;
}

/**
 *  `P2001` = record not found & `P2015` = Related record not found
 *  `P2002` = record already exists or unique constraint violation
 *  `P2005` & `P2006` = invalid input
 *  `P2007` = Could not validate data
 *  `P2011` = Value must not be null
 *  `P2012` =  Value is required
 *
 * @param error PrismaClientKnownRequestError
 * @returns DatabaseError
 **/
export function handlePrismaClientKnownRequestError(
    error: PrismaClientKnownRequestError
): DatabaseError {
    let err: DatabaseError;
    if (error.code === 'P2001' || error.code === 'P2015') {
        err = new RecordNotFoundError('Record not found');
    } else if (error.code === 'P2002') {
        const fields = getFieldFromMeta(error.meta);
        err = new FieldMustBeUniqueError(`Field(s) ${fields} must be unique`);
    } else if (
        error.code === 'P2005' ||
        error.code === 'P2006' ||
        error.code === 'P2007' ||
        error.code === 'P2011'
    ) {
        const fields = getFieldFromMeta(error.meta);
        err = new InvalidInputError('Invalid input for fields: ' + fields);
    } else if (error.code === 'P2012') {
        const fields = getFieldFromMeta(error.meta);
        err = new InvalidInputError(`Field(s) ${fields} is required`);
    } else {
        err = new InternalDbError(
            'An error occurred while processing your data'
        );
    }

    return err;
}

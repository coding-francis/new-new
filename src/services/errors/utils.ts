import { ZodError } from 'zod';
import {
    DatabaseError,
    InternalDbError,
    RecordNotFoundError,
} from '../../data/errors';
import { BaseServiceLayerError } from '.';
import { UncaughtServiceError } from './uncaught-service-error';
import { DataValidationError } from './data-validation-error';
import { ResourceNotFoundServiceError } from './resource-not-found-error';

/**
 * This function will handle the error thrown from the data layer or zod and return the appropriate error to be thrown from the service layer.
 *
 * @param {Error} error
 * @returns {BaseServiceLayerError}
 *
 * @example
 * try {
 *   // some code
 *  throw new Error("Some error");
 * } catch (error) {
 *  const err = handleServiceError(error as Error);
 * throw err;
 * }
 *
 */
export function handleServiceError(error: Error): BaseServiceLayerError {
    let err: BaseServiceLayerError;
    //We expect error to be thrown from the data layer
    if (error instanceof DatabaseError) {
        if (error instanceof RecordNotFoundError) {
            err = new ResourceNotFoundServiceError(error.message);
        } else if (error instanceof InternalDbError) {
            err = new UncaughtServiceError();
        } else {
            //The rest of the error from the data layer can be identified as DataValidationError
            err = new DataValidationError(error.message);
        }
        //We expect error to be thrown from the ZOD validation
    } else if (error instanceof ZodError) {
        err = new DataValidationError(error.message, error.errors);
    } else {
        err = new UncaughtServiceError();
    }

    return err;
}

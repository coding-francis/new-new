import {
    BaseServiceLayerError,
    ResourceNotFoundServiceError,
    DataValidationError,
} from '../../services/errors';
import { HttpBadError, HttpNotFoundError, HttpServerError } from './exceptions';

export function handleErrors(err: Error): Error {
    let error = new HttpServerError('Internal server error');
    if (
        err instanceof BaseServiceLayerError &&
        err instanceof ResourceNotFoundServiceError
    ) {
        error = new HttpNotFoundError(error.message, error.data);
    } else if (err instanceof DataValidationError) {
        error = new HttpBadError(error.message, error.data);
    }

    return error;
}

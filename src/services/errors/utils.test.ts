import { ZodError } from 'zod';
import {
    InternalDbError,
    RecordNotFoundError,
    FieldMustBeUniqueError,
} from '../../data/errors/index.ts';
import { DataValidationError } from './data-validation-error.ts';
import { ResourceNotFoundServiceError } from './resource-not-found-error.ts';
import { UncaughtServiceError } from './uncaught-service-error.ts';
import { handleServiceError } from './utils.ts';

describe('Utils - handleServiceError', () => {
    test('Should return `ResourceNotFoundServiceError` when `RecordNotFoundError` is thrown', () => {
        const error = new RecordNotFoundError('Record not found');
        const err = handleServiceError(error);
        expect(err).toBeInstanceOf(ResourceNotFoundServiceError);
    });

    test('Should return `UncaughtServiceError` when `InternalDbError` is thrown', () => {
        const error = new InternalDbError('Record not found');
        const err = handleServiceError(error);
        expect(err).toBeInstanceOf(UncaughtServiceError);
    });

    test('Should return `DataValidationError` when `FieldMustBeUniqueError` is thrown', () => {
        const error = new FieldMustBeUniqueError('Field must be unique');
        const err = handleServiceError(error);
        expect(err).toBeInstanceOf(DataValidationError);
    });

    test('Should return `DataValidationError` when `ZodError` is thrown', () => {
        const error = new ZodError([
            {
                message: 'Invalid value',
                code: 'invalid_type',
                path: ['email'],
                received: 'number',
                expected: 'string',
            },
        ]);
        const err = handleServiceError(error);
        expect(err).toBeInstanceOf(DataValidationError);
    });

    test('Should return `UncaughtServiceError` when an unknown error is thrown', () => {
        const error = new Error('Unknown error');
        const err = handleServiceError(error);
        expect(err).toBeInstanceOf(UncaughtServiceError);
    });
});

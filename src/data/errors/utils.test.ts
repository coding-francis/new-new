import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RecordNotFoundError } from './record-not-found';
import { handlePrismaClientKnownRequestError } from './utils';
import { FieldMustBeUniqueError } from './must-be-unique-error';
import { InvalidInputError } from './invalid-input-error';
import { InternalDbError } from './internal-db-error';

describe('utils', () => {
    test('Should return RecordNotFoundError when code is `P2001`', () => {
        // Arrange
        const error: PrismaClientKnownRequestError =
            new PrismaClientKnownRequestError('Record not found', {
                code: 'P2001',
                clientVersion: '2.0.0',
                meta: { target: ['id'] },
            });

        // Act
        const err = handlePrismaClientKnownRequestError(error);

        // Assert
        expect(err).toBeInstanceOf(RecordNotFoundError);
    });

    test('Should return RecordNotFoundError when code is `P2015`', () => {
        // Arrange
        const error: PrismaClientKnownRequestError =
            new PrismaClientKnownRequestError('Record not found', {
                code: 'P2015',
                clientVersion: '2.0.0',
                meta: { target: ['id'] },
            });

        // Act
        const err = handlePrismaClientKnownRequestError(error);

        // Assert
        expect(err).toBeInstanceOf(RecordNotFoundError);
    });

    test('Should return FieldMustBeUniqueError when code is `P2002`', () => {
        // Arrange
        const error: PrismaClientKnownRequestError =
            new PrismaClientKnownRequestError('Unique constraint violated', {
                code: 'P2002',
                clientVersion: '2.0.0',
                meta: { target: ['id'] },
            });

        // Act
        const err = handlePrismaClientKnownRequestError(error);

        // Assert
        expect(err).toStrictEqual(
            new FieldMustBeUniqueError('Field(s) id must be unique')
        );
    });

    test('Should return InvalidInputError when code is `P2005`', () => {
        // Arrange
        const error: PrismaClientKnownRequestError =
            new PrismaClientKnownRequestError('Invalid input', {
                code: 'P2005',
                clientVersion: '2.0.0',
                meta: { target: ['id'] },
            });

        // Act
        const err = handlePrismaClientKnownRequestError(error);

        // Assert
        expect(err).toStrictEqual(
            new InvalidInputError('Invalid input for fields: id')
        );
    });

    test('Should return InvalidInputError when code is `P2006`', () => {
        // Arrange
        const error: PrismaClientKnownRequestError =
            new PrismaClientKnownRequestError('Invalid input', {
                code: 'P2006',
                clientVersion: '2.0.0',
                meta: { target: ['id'] },
            });

        // Act
        const err = handlePrismaClientKnownRequestError(error);

        // Assert
        expect(err).toStrictEqual(
            new InvalidInputError('Invalid input for fields: id')
        );
    });

    test('Should return InvalidInputError when code is `P2007`', () => {
        // Arrange
        const error: PrismaClientKnownRequestError =
            new PrismaClientKnownRequestError('Invalid input', {
                code: 'P2007',
                clientVersion: '2.0.0',
                meta: { target: ['id'] },
            });

        // Act
        const err = handlePrismaClientKnownRequestError(error);

        // Assert
        expect(err).toStrictEqual(
            new InvalidInputError('Invalid input for fields: id')
        );
    });

    test('Should return InvalidInputError when code is `P2011`', () => {
        // Arrange
        const error: PrismaClientKnownRequestError =
            new PrismaClientKnownRequestError('Invalid input', {
                code: 'P2011',
                clientVersion: '2.0.0',
                meta: { target: ['id'] },
            });

        // Act
        const err = handlePrismaClientKnownRequestError(error);

        // Assert
        expect(err).toStrictEqual(
            new InvalidInputError('Invalid input for fields: id')
        );
    });

    test('Should return InvalidInputError when code is `P2012`', () => {
        // Arrange
        const error: PrismaClientKnownRequestError =
            new PrismaClientKnownRequestError('Invalid input', {
                code: 'P2012',
                clientVersion: '2.0.0',
                meta: { target: ['id'] },
            });

        // Act
        const err = handlePrismaClientKnownRequestError(error);

        // Assert
        expect(err).toStrictEqual(
            new InvalidInputError('Field(s) id is required')
        );
    });

    test('Should return InternalDbError for any other code', () => {
        // Arrange
        const error: PrismaClientKnownRequestError =
            new PrismaClientKnownRequestError('Unknown error', {
                code: 'P2062',
                clientVersion: '2.0.0',
                meta: { target: ['id'] },
            });

        // Act
        const err = handlePrismaClientKnownRequestError(error);

        // Assert
        expect(err).toStrictEqual(
            new InternalDbError('An error occurred while processing your data')
        );
    });
});

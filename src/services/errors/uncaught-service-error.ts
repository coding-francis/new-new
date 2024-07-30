import { BaseServiceLayerError } from './base-error.ts';

export class UncaughtServiceError extends BaseServiceLayerError {
    constructor(message = 'Unidentified error occured') {
        super(message, 'UncaughtServiceError');
    }
}

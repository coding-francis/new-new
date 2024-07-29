import { BaseServiceLayerError } from '.';

export class UncaughtServiceError extends BaseServiceLayerError {
    constructor(message = 'Unidentified error occured') {
        super(message, 'UncaughtServiceError');
    }
}

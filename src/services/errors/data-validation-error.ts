import { BaseServiceLayerError } from './base-error.ts';

export class DataValidationError extends BaseServiceLayerError {
    constructor(message: string, data?: object) {
        super(message, 'DataValidationError', data);
    }
}

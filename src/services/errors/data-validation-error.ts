import { BaseServiceLayerError } from '.';

export class DataValidationError extends BaseServiceLayerError {
    constructor(message: string, data?: object) {
        super(message, 'DataValidationError', data);
    }
}

import { BaseServiceLayerError } from '.';

export class ResourceNotFoundServiceError extends BaseServiceLayerError {
    constructor(message: string = 'Resource not found') {
        super(message, 'ResourceNotFoundError');
    }
}

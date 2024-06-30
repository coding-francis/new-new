/**
 * The main app error class that all other errors will inherit from in this application.
 * This gives us information of which layer the error is coming from.
 * We can add more metrics to this class to help us debug and monitor the application.
 *
 * @abstract
 * @class MainAppError
 * @extends {Error}
 * @property {string} layer - The layer the error is coming from
 * @property {string} name - The name of the error
 * @property {string} message - The error message
 *
 * @example
 * class RecordNotFoundError extends MainAppError {
 *    constructor(message: string) {
 *       super(message, 'RecordNotFoundError', 'DataLayer');
 *   }
 * }
 **/
export default abstract class MainAppError extends Error {
    public layer: string;
    constructor(message: string, name: string, layer: string) {
        super(message);
        this.name = name;
        this.layer = layer;
    }
}

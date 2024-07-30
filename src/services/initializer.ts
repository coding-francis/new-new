import { DataLayer } from '../data/index.ts';
import { pick } from 'lodash';
import { UserService, UserServiceLayer } from './user-service.ts';
import { Logger } from '../internal/logger.ts';

export interface Service {
    UserService: UserServiceLayer;
}

/**
 * Initialize all services with the data layer. This will be called in the main application file or test files.
 * User lodash's pick function to only pass the required data layer classes to the services.
 *
 * @param {DataLayer} dataLayer The data layer object containing all data layer classes.
 * @param {Logger} logger Logger object to log the error.
 * @returns {Service} The service object containing all services.
 *
 * @example
 * const dataLayer = initializeDataLayer();
 * const logger = initializeLogger();
 * const services = initializeServices(dataLayer, logger);
 * const userService = services.UserService;
 * const user = await userService.getUserById(1);
 */
export function initializeServices(
    dataLayer: DataLayer,
    logger: Logger
): Service {
    return {
        UserService: new UserService(pick(dataLayer, 'UserDataLayer'), logger),
    };
}

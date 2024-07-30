import { PrismaClient } from '@prisma/client/extension';
import { DataBase } from '../internal/database.ts';
import { Logger } from '../internal/logger.ts';
import UserData, { UserDataLayer } from './user-data-layer.ts';

export interface DataLayer {
    UserDataLayer: UserDataLayer;
}

/**
 * Initialize the data layer with the database and logger. This is called in the main application entrypoint eg: `bin/index.ts` or initializing in test file .
 *
 * @param {DataBase<PrismaClient>} db - The database connection object
 * @param {Logger} logger - The logger object
 *
 * @returns {DataLayer} - The data layer object
 *
 * @example
 * const db = new PrismaDatabase('dbUrl');
 * const logger = new Logger();
 * const dataLayer = initializeDataLayer(db, logger);
 */
export const initializeDataLayer = (
    db: DataBase<PrismaClient>,
    logger: Logger
): DataLayer => {
    return {
        UserDataLayer: new UserData(db, logger),
    };
};

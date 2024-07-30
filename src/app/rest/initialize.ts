import { pick } from 'lodash';
import { Service } from '../../services/index.ts';
import { fetchUserByIdRouteOption } from './user-handlers.ts';

export function initializeRestHandlers(srv: Service) {
    return [fetchUserByIdRouteOption(pick(srv, 'UserService'))];
}

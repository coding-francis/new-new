import { pick } from 'lodash';
import { Service } from '../../services/index';
import fetchUserByIdRouteOption from './user-handlers';

export function initializeRestHandlers(srv: Service) {
    return [fetchUserByIdRouteOption(pick(srv, 'UserService'))];
}

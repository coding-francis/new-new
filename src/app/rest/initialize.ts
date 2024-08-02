import { pick } from 'lodash';
import { Service } from '../../services/index';
import createUserRouteOption from './user-handlers/create-user.handler';
import fetchUserByIdRouteOption from './user-handlers/find-by-id.handler';

export function initializeRestHandlers(srv: Service) {
    return [
        createUserRouteOption(pick(srv, 'UserService')),
        fetchUserByIdRouteOption(pick(srv, 'UserService')),
    ];
}

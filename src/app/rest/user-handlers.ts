import { Service } from '../../services';
import {
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    RouteHandler,
    RouteOptions,
} from 'fastify';
import {
    BaseServiceLayerError,
    ResourceNotFoundServiceError,
} from '../../services/errors';
import { HttpNotFoundError, HttpServerError } from './exceptions';
import { UserResource } from '../../services/resource';

interface URLParams {
    id: string;
}

//I thought of adding handler to RouteOptions but I felt I needed the handler as  a `controller` function seperated from the metadata. It involves you passing
// the service twice and also typing the handler function twice. I think it's better to have the handler as a function and then pass it to the RouteOptions.
//Always don't export handler functions, export the RouteOptions and the RouteHandler.
function fetchUserById(
    srv: Pick<Service, 'UserService'>
): RouteHandler<{ Params: URLParams }> {
    return async (req, res) => {
        try {
            const user = await srv.UserService.getUserById(
                Number(req.params.id)
            );
            res.status(200).send(user);
        } catch (error) {
            if (
                error instanceof BaseServiceLayerError &&
                error instanceof ResourceNotFoundServiceError
            ) {
                throw new HttpNotFoundError(error.message, error.data);
            }

            throw new HttpServerError('Internal server error');
        }
    };
}

export function fetchUserByIdRouteOption(
    srv: Pick<Service, 'UserService'>
): RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    { Params: URLParams }
> {
    return {
        handler: fetchUserById(srv),
        method: 'GET',
        url: '/users/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
            },
            response: {
                200: UserResource.schema,
                404: HttpNotFoundError.schema,
                500: HttpServerError.schema,
            },
        },
    };
}

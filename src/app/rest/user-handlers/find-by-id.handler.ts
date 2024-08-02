import { Service } from '../../../services';
import {
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    RouteHandler,
    RouteOptions,
} from 'fastify';
import { HttpNotFoundError, HttpServerError } from '../exceptions';
import { UserResource } from '../../../services/resource';
import { handleErrors } from '../utils';

interface URLParams {
    id: string;
}

//I thought of adding handler to RouteOptions but I felt I needed the handler as  a `controller` function seperated from the metadata. It involves you passing
// the service twice and also typing the handler function twice. I think it's better to have the handler as a function and then pass it to the RouteOptions.
//Always don't export handler functions, export the RouteOptions and the RouteHandler.
function fetchUserByIdHandler(
    srv: Pick<Service, 'UserService'>
): RouteHandler<{ Params: URLParams }> {
    return async (req, res) => {
        try {
            const user = await srv.UserService.getUserById(
                Number(req.params.id)
            );
            req.log.info(`User with id ${req.params.id} fetched`);
            res.status(200).send(user);
        } catch (error) {
            req.log.error(error);
            const httpError = handleErrors(error as Error);
            throw httpError;
        }
    };
}

//Always export the RouteOptions as default.
export default function HandlerRouteOption(
    srv: Pick<Service, 'UserService'>
): RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    { Params: URLParams; Body: unknown }
> {
    return {
        handler: fetchUserByIdHandler(srv),
        method: 'GET',
        url: '/users/:id',
        schema: {
            description: 'Fetch user by id',
            tags: ['User'],
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

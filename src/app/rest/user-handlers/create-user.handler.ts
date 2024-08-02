import {
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    RouteHandler,
    RouteOptions,
} from 'fastify';
import { CreateUserPayload, Service } from '../../../services';
import { handleErrors } from '../utils';
import { UserResource } from '../../../services/resource';
import { HttpBadError, HttpServerError } from '../exceptions';

function createUserHandler(
    srv: Pick<Service, 'UserService'>
): RouteHandler<{ Body: CreateUserPayload }> {
    return async (req, res) => {
        try {
            const user = await srv.UserService.createUser(req.body);
            req.log.info(user, `User with id`);
            res.status(201).send(user);
        } catch (error) {
            req.log.error(error);
            const httpError = handleErrors(error as Error);
            throw httpError;
        }
    };
}

export default function HandlerRouteOption(
    srv: Pick<Service, 'UserService'>
): RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    { Body: CreateUserPayload; Params: unknown }
> {
    return {
        handler: createUserHandler(srv),
        method: 'POST',
        url: '/users',
        schema: {
            description: 'Create a user',
            tags: ['User'],
            body: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 255,
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        maxLength: 255,
                    },
                    password: { type: 'string', minLength: 8, maxLength: 255 },
                },
                required: ['email', 'password'],
            },
            response: {
                201: UserResource.schema,
                400: HttpBadError.schema,
                500: HttpServerError.schema,
            },
        },
    };
}

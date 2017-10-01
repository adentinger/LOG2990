import 'reflect-metadata';
import * as express from 'express';
import { console } from '../../../common/utils';

type RequestHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => void;
export type RouteType = 'get' | 'post' | 'put' | 'delete' | 'head' | 'all';

interface MiddleWareMetadata {
    constructor: Function;
    baseRoute: string;
}

const REGISTER_FUNCTION = Symbol('registerFunction');
const MIDDLEWARE_ROUTES = Symbol('routes');
const MIDDLEWARES: MiddleWareMetadata[] = [];

interface RouteEntry {
    type: RouteType | 'use';
    value: string;
    handler: RequestHandler;
}

// Decorator
export function MiddleWare<T extends Function>(constructor: T): void;
// Decorator Factory
export function MiddleWare<T extends Function>(baseRoute: string): ClassDecorator;
export function MiddleWare<T extends Function>(baseRoute: string | T): ClassDecorator | void {
    const MIDDLEWARE_DECORATOR: ClassDecorator = function (constructor: Function): void {
        constructor.prototype[REGISTER_FUNCTION] = (router: express.Router): void => {
            const routes: RouteEntry[] = Reflect.getOwnMetadata(MIDDLEWARE_ROUTES, constructor) || [];
            for (const route of routes) {
                const ROUTING_ARGUMENTS: any[] = [];
                if (route.value) {
                    ROUTING_ARGUMENTS.push(route.value);
                }
                ROUTING_ARGUMENTS.push(route.handler);
                router[route.type].apply(router, ROUTING_ARGUMENTS);
                console.log('Routed ' + (route.value ? route.type.toUpperCase() : '') +
                    ' requests at "' + (route.value || '/') +
                    '" to ' + constructor.name);
            }
        };
        MIDDLEWARES.push({
            constructor,
            baseRoute: typeof baseRoute === 'string' && baseRoute || null
        });
    };
    if (typeof baseRoute === 'string') {
        return MIDDLEWARE_DECORATOR;
    } else {
        MIDDLEWARE_DECORATOR(baseRoute);
    }
}

// Decorator factory
export function Route(type: RouteType, route: string): MethodDecorator;
export function Route(type: 'use'): MethodDecorator;
export function Route(type: RouteType | 'use', route?: string): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
        const ORIGINAL_FUNCTION = descriptor.value;
        descriptor.value = function (...argv: any[]): any {
            console.log('[INFO] Handling ' + (route ? type.toUpperCase() : '') +
                ' request to "' + route + '"');
            return ORIGINAL_FUNCTION.apply(this, argv);
        };

        const routes: RouteEntry[] = Reflect.getOwnMetadata(MIDDLEWARE_ROUTES, target.constructor) || [];
        routes.push({ type: type, value: route, handler: descriptor.value } as RouteEntry);
        Reflect.defineMetadata(MIDDLEWARE_ROUTES, routes, target.constructor);
    };
}

export function registerMiddleWares(router: express.Router) {
    const EMPTY_ARGUMENT_LIST = [] as ArrayLike<any>;
    let middlewareRouter: express.Router;
    for (const middleWare of MIDDLEWARES) {
        middlewareRouter = router;

        if (middleWare.baseRoute) {
            middlewareRouter = express.Router();
            router.use(middleWare.baseRoute, middlewareRouter);
            console.log('Registering sub-routes of "' + middleWare.baseRoute + '"');
            console.pushPrefix('\t');
        }
        Reflect.construct(middleWare.constructor, EMPTY_ARGUMENT_LIST)[REGISTER_FUNCTION](middlewareRouter);
        if (middleWare.baseRoute) {
            console.popPrefix();
        }
    }
}

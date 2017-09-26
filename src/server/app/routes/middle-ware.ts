import 'reflect-metadata';
import * as express from 'express';

type RequestHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => void;
type RouteType = 'get' | 'post' | 'put' | 'delete' | 'head';
interface Constructible {
    new (...args: any[]): {};
}

const REGISTER_FUNCTION = Symbol('registerFunction');
const MIDDLEWARE_ROUTES = Symbol('routes');
const MIDDLEWARES: Function[] = [];

interface RouteEntry {
    type: RouteType;
    value: string;
    handler: RequestHandler;
}

export function MiddleWare<T extends Constructible>(constructor: T) {
    constructor.prototype[REGISTER_FUNCTION] = (router: express.Router): void => {
        const routes: RouteEntry[] = Reflect.getOwnMetadata(MIDDLEWARE_ROUTES, constructor) || [];
        for (const route of routes) {
            router[route.type](route.value, route.handler);
            console.log('Routed ' + route.type.toUpperCase() +
                        ' requests at "' + route.value +
                        '" to ' + constructor.name + '.' + route.handler.name);
        }
    };
    MIDDLEWARES.push(constructor);
}

// Decorator factory
export function Route(type: RouteType, route: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const routes: RouteEntry[] = Reflect.getOwnMetadata(MIDDLEWARE_ROUTES, target.constructor) || [];
        routes.push({type: type, value: route, handler: target[propertyKey]} as RouteEntry);
        Reflect.defineMetadata(MIDDLEWARE_ROUTES, routes, target.constructor);
    };
}

export function registerMiddleWares(router: express.Router) {
    const EMPTY_ARGUMENT_LIST = [] as ArrayLike<any>;
    for (const middleWare of MIDDLEWARES) {
        Reflect.construct(middleWare, EMPTY_ARGUMENT_LIST)[REGISTER_FUNCTION](router);
    }
}

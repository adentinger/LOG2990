import 'reflect-metadata';
import * as express from 'express';

type RequestHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => void;
type RouteType = 'get' | 'post' | 'put' | 'delete' | 'head';
interface Constructible {
    new (...args: any[]): {};
}

const registerSymbole = Symbol('register');
const middlewareRoutes = Symbol('routes');
const middleWares: Function[] = [];

interface RouteEntry {
    type: RouteType;
    value: string;
    handler: RequestHandler;
}

export function MiddleWare<T extends Constructible>(constructor: T) {
    constructor.prototype[registerSymbole] = (router: express.Router): void => {
        const routes: RouteEntry[] = Reflect.getOwnMetadata(middlewareRoutes, constructor) || [];
        for (const route of routes) {
            router[route.type](route.value, route.handler);
            console.log('Routed ' + route.type.toUpperCase() +
                        ' requests at "' + route.value +
                        '" to ' + constructor.name + '.' + route.handler.name);
        }
    };
    middleWares.push(constructor);
}

// Decorator factory
export function Route(type: RouteType, route: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const routes: RouteEntry[] = Reflect.getOwnMetadata(middlewareRoutes, target.constructor) || [];
        routes.push({type: type, value: route, handler: target[propertyKey]} as RouteEntry);
        Reflect.defineMetadata(middlewareRoutes, routes, target.constructor);
    };
}

export function registerMiddleWares(router: express.Router) {
    for (const middleWare of middleWares) {
        Reflect.construct(middleWare, [])[registerSymbole](router);
    }
}

import 'reflect-metadata';
import * as express from 'express';

type RequestHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => void;

const middlewareRoutes = Symbol('middlewareRoutes');
const middlewareContainers = Symbol('middlewareContainers');
const middleWares: RequestHandler[] = [];

// Decorator factory
export function Route(route: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(middlewareContainers, target, target[propertyKey]);
        Reflect.defineMetadata(middlewareRoutes, route, target[propertyKey]);
        middleWares.push(target[propertyKey]);
    };
}

export function registerMiddleWares(router: express.Router) {
    for (const middleWare of middleWares) {
        const route = Reflect.getMetadata(middlewareRoutes, middleWare);
        const container = Reflect.getMetadata(middlewareContainers, middleWare);
        router.get(route, middleWare.bind(middleWare));
        console.log('@MiddleWare[run]', 'Routed ' + container.constructor.name + '.' + middleWare.name + ' to "' + route + '"');
    }
}

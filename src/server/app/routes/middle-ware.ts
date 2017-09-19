import 'reflect-metadata';
import * as express from 'express';

type RequestHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => void;

type RouteTypes = 'get' | 'post' | 'put' | 'delete' | 'head';

const middlewareRoutes = Symbol('middlewareRoutes');
const middlewareContainers = Symbol('middlewareContainers');
const middlewareRequestType = Symbol('middlewareRequestType');
const middleWares: RequestHandler[] = [];

// Decorator factory
export function Route(type: RouteTypes, route: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(middlewareContainers, target, target[propertyKey]);
        Reflect.defineMetadata(middlewareRoutes, route, target[propertyKey]);
        Reflect.defineMetadata(middlewareRequestType, type, target[propertyKey]);
        middleWares.push(target[propertyKey]);
    };
}

export function registerMiddleWares(router: express.Router) {
    for (const middleWare of middleWares) {
        const route = Reflect.getMetadata(middlewareRoutes, middleWare);
        const container = Reflect.getMetadata(middlewareContainers, middleWare);
        const requestType = Reflect.getMetadata(middlewareRequestType, middleWare) as RequestType;
        router[requestType](route, middleWare.bind(middleWare));
        console.log('Routed ' + requestType.toUpperCase() +
                    ' requests at "' + route +
                    '" to ' + container.constructor.name + '.' + middleWare.name);
    }
}

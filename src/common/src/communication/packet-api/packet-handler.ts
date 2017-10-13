import { Constructor, Class, InstanceOf } from '../../utils';
import { PacketParser } from './packet-parser';
import { PacketEvent } from './packet-event';
import { PacketManagerBase, Socket } from './packet-manager-base';

const parsers: [Class<any>, Constructor<PacketParser<any>>][] = [];

// Decorator
export function Parser<T>(type: Class<T>) {
    return function Parser<P extends PacketParser<T>>(constructor: Constructor<P>) {
        console.log(`[Packet] New parser for ${type.name} [${constructor.name}]`);
        parsers.push([type, constructor]);
    };
}

export function registerParsers(packetManager: PacketManagerBase<any>): void {
    for (const parser of parsers) {
        packetManager.registerParser(parser[0], new (parser[1]));
    }
}

const handlers: Map<Class<any>, Map<Class<any>, Set<string>>> = new Map();
export declare type PacketHandler<T> = (event: PacketEvent<T>) => void;

// Decorator
export function PacketHandler<T>(dataType: Class<T>): MethodDecorator {
    return function <U extends Class<any>>(target: U, propertyKey: string, descriptor: PropertyDescriptor & { value?: PacketHandler<T> }) {
        console.log(`[Packet] New handler for ${dataType.name} [${target.constructor.name}.${propertyKey}]`);
        if (!handlers.has(target.constructor)) {
            handlers.set(target.constructor, new Map());
        }
        if (!handlers.get(target.constructor).has(dataType)) {
            handlers.get(target.constructor).set(dataType, new Set());
        }
        handlers.get(target.constructor).get(dataType).add(propertyKey);
    };
}

export declare interface PacketManagerContainter<S extends Socket> {
    packetManager: PacketManagerBase<S>;
}

export function PacketHandlerClass() {
    return function <T extends Constructor<PacketManagerContainter<Socket>>>(target: T) {
        console.log(`[Packet] New class of handlers: ${target.name}`);
        if (!handlers.has(target)) {
            handlers.set(target, new Map());
        }
        return class extends target {
            constructor(...argv: any[]) {
                super(...argv);
                registerHandlers(this, this.packetManager);
            }
        } as T;
    };
}

const TRY_COUNT_MAX = 100;
export function registerHandlers<T extends InstanceOf<Constructor<T>>>(that: T, packetManager: PacketManagerBase<Socket>) {
    console.log(`[Packet] [${that.constructor.name}] Registering handlers`);
    let prototype = that, i = 0;
    let thatHandlers: Map<Class<any>, Set<string>>;
    while (!handlers.has(prototype.constructor) && ++i < TRY_COUNT_MAX) {
        prototype = Object.getPrototypeOf(prototype);
    }
    thatHandlers = handlers.get(prototype.constructor);
    thatHandlers.forEach((handlerList, type) => {
        for (const handler of handlerList) {
            packetManager.registerHandler(type, that[handler].bind(that));
        }
    });
}

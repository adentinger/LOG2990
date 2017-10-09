import { Constructor, Class } from '../../utils';
import { PacketParser, PacketEvent } from './';
import { PacketManagerBase } from './packet-manager-base';

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

const handlers: [Class<any>, PacketHandler<any>][] = [];
export declare type PacketHandler<T> = (event: PacketEvent<T>) => void;
// Decorator
export function PacketHandler<T>(dataType: Class<T>) {
    return function <U>(target: Class<U>, propertyKey: string, descriptor: PropertyDescriptor & {value?: PacketHandler<T>}) {
        console.log(`[Packet] New handler for ${dataType.name} [${target.name}.${descriptor.value.name}]`);
        handlers.push([dataType, descriptor.value.bind(target)]);
    };
}

export function registerHandlers(packetManager: PacketManagerBase<any>): void {
    for (const handler of handlers) {
        console.log(`[Packet] [registerHandlers] ${handler[1].name} => ${handler[0].name}`);
        packetManager.registerHandler(handler[0], handler[1]);
    }
}

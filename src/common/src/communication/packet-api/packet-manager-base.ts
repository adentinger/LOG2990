import { Constructor, toArrayBuffer, Class } from '../../utils';
import { PacketParser } from './packet-parser';
import { PacketHandler, registerParsers, registerHandlers } from './packet-handler';
import { PacketEvent } from './packet-event';

export declare type On = (event: string, listener: Function) => {on: On};
export declare interface Socket {
    id: string;
    on: On;
    send: (...argv: any[]) => this;
}

export abstract class PacketManagerBase<Sock extends Socket> {
    private static readonly PACKET_MESSAGE_MATCHER = /^packet:([a-zA-Z_][a-zA-Z0-9_$]*)$/i;
    protected parsers: Map<Constructor<any>, PacketParser<any>> = new Map();
    private handlers: Map<Constructor<any>, PacketHandler<any>[]> = new Map();

    /**
     * Must be called at the end of the child class' constructor
     */
    protected register() {
        registerParsers(this);
        registerHandlers(this);
    }

    protected registerParserToSocket<T>(socket: Sock, parserEntry: [Constructor<T>, PacketParser<T>]) {
        const messageHandler = (eventType: string, data: string) => {
            console.log(`[Packet] message: ${eventType}`);
            if (PacketManagerBase.PACKET_MESSAGE_MATCHER.test(eventType)) {
                eventType = eventType.match(PacketManagerBase.PACKET_MESSAGE_MATCHER)[1];
                if (eventType === parserEntry[0].name) {
                    console.log(`[Packet] Reception "${eventType}"`);
                    const object = parserEntry[1].parse(toArrayBuffer(data));
                    const handlerList = this.handlers.get(parserEntry[0]) || [];
                    handlerList.forEach((handler: PacketHandler<T>) => {
                        handler(new PacketEvent<T>(object, socket.id));
                    });
                }
            }
        };
        socket.on('message', messageHandler);
    }

    public registerHandler<T>(type: Constructor<T>, handler: PacketHandler<T>): void {
        console.log(`[Packet] New handler for ${type.name} [${handler.name}]`);
        const handlerList = this.handlers.get(type) || [];
        handlerList.push(handler);
        console.log(handlerList);
        this.handlers.set(type, handlerList);
    }

    public abstract sendPacket<T>(type: Class<T>, data: T, socketid: string): void;

    public abstract registerParser<T>(type: Class<T>, parser: PacketParser<T>): void;
}

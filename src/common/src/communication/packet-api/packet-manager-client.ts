import 'socket.io';
import 'socket.io-client';
import { PacketParser } from './packet-parser';
import { PacketEvent } from './packet-event';
import { Constructor, fromArrayBuffer, toArrayBuffer } from '../../utils';

export type PacketHandlerClient<T> = (event: PacketEvent<T>) => void;

export class PacketManagerClient {
    private static readonly PACKET_MESSAGE_MATCHER = /^packet:([a-zA-Z_][a-zA-Z0-9_$]*)$/i;
    private parsers: Map<Constructor<any>, PacketParser<any>> = new Map();
    private handlers: Map<Constructor<any>, PacketHandlerClient<any>[]> = new Map();

    constructor(private socket: SocketIOClient.Socket) { }

    private registerParserToSocket<T>(socket: SocketIOClient.Socket,
                                      parserEntry: [Constructor<T>, PacketParser<T>]) {
        const messageHandler = (eventType: string, data: string) => {
            console.log(`[Packet] message: ${eventType}`);
            if (PacketManagerClient.PACKET_MESSAGE_MATCHER.test(eventType)) {
                eventType = eventType.match(PacketManagerClient.PACKET_MESSAGE_MATCHER)[1];
                if (eventType === parserEntry[0].name) {
                    console.log(`[Packet] Reception "${eventType}"`);
                    const object = parserEntry[1].parse(toArrayBuffer(data));
                    const handlerList = this.handlers.get(parserEntry[0]) || [];
                    handlerList.forEach((handler: PacketHandlerClient<T>) => {
                        handler(new PacketEvent<T>(object, socket.id));
                    });
                }
            }
        };
        socket.on('message', messageHandler);
    }

    public registerHandler<T>(type: Constructor<T>, handler: PacketHandlerClient<T>): void {
        const handlerList = this.handlers.get(type) || [];
        handlerList.push(handler);
        this.handlers.set(type, handlerList);
    }

    public sendPacket<T>(type: Constructor<T>, data: T): void {
        if (this.parsers.get(type)) {
            const parser = this.parsers.get(type);
            console.log(`[Packet] Sending: {to server} "${type.name}" ${data}`);
            this.socket.send('packet:' + type.name,
                fromArrayBuffer(parser.serialize(data)));
        }
    }

    public registerParser<T>(type: Constructor<T>, parser: PacketParser<T>) {
        this.parsers.set(type, parser);
        this.registerParserToSocket(this.socket, [type, parser]);
    }
}

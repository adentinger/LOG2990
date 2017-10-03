import 'socket.io';
import 'socket.io-client';
import { PacketParser } from './packet-parser';
import { PacketEvent } from './packet-event';
import { Constructor, fromArrayBuffer, toArrayBuffer } from '../../utils';

export type Server = SocketIO.Server;
export type Socket = SocketIO.Socket;

export type PacketHandler<T> = (event: PacketEvent<T>) => void;

export class PacketManagerServer {
    private static readonly PACKET_MESSAGE_MATCHER = /^packet:([a-zA-Z_][a-zA-Z0-9_$]*)$/i;
    private parsers: Map<Constructor<any>, PacketParser<any>> = new Map();
    private knownSockets: Map<string, Socket> = new Map();
    private handlers: Map<Constructor<any>, PacketHandler<any>[]> = new Map();

    constructor(private serverSocket: Server) {
        this.serverSocket.on('connection', this.onConnection.bind(this));
    }

    private registerParserToSocket<T>(socket: Socket, parserEntry: [Constructor<T>, PacketParser<T>]) {
        const messageHandler = (eventType: string, data: string) => {
            console.log(`[Packet] message: ${eventType}`);
            if (PacketManagerServer.PACKET_MESSAGE_MATCHER.test(eventType)) {
                eventType = eventType.match(PacketManagerServer.PACKET_MESSAGE_MATCHER)[1];
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

    private onConnection(socket: Socket) {
        console.log(`[Packet] New connection on "${socket.handshake.url}"`);
        this.knownSockets.set(socket.id, socket);
        for (const parserEntry of this.parsers) {
            this.registerParserToSocket(socket, parserEntry);
        }
    }

    public registerHandler<T>(type: { new(...argv: any[]): T }, handler: PacketHandler<T>): void {
        const handlerList = this.handlers.get(type) || [];
        handlerList.push(handler);
        this.handlers.set(type, handlerList);
    }

    public sendPacket<T>(socketid: string, type: { new(...argv: any[]): T }, data: T): void {
        if (this.parsers.get(type) && this.knownSockets.has(socketid)) {
            const parser = this.parsers.get(type);
            console.log(`[Packet] Sending: {socket #${socketid}} "${type.name}" ${data}`);
            this.knownSockets.get(socketid).send('packet:' + type.name,
                fromArrayBuffer(parser.serialize(data)));
        }
    }

    public registerParser<T>(type: { new(...argv: any[]): T }, parser: PacketParser<T>) {
        this.parsers.set(type, parser);
        for (const socket of this.knownSockets.values()) {
            this.registerParserToSocket(socket, [type, parser]);
        }
    }
}

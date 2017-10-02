import 'socket.io';
import * as ClientIO from 'socket.io-client';
import { PacketParser } from './packet-parser';
import { EventEmitter } from 'events';
import { PacketEvent } from './packet-event';

export type Server = SocketIO.Server | SocketIOClient.Socket;
export type Socket = SocketIO.Socket | SocketIOClient.Socket;

export type PacketHandler<T> = (socket: Socket, event: PacketEvent<T>) => void;

export class PacketManager {
    private static readonly PACKET_MESSAGE_MATCHER = /^packet:([a-zA-Z_][a-zA-Z0-9_$]*)$/i;
    public readonly events: EventEmitter = new EventEmitter();
    private parsers: Map<Function, PacketParser<any>> = new Map();
    private knownSockets: Map<string, Socket> = new Map();
    private handlers: Map<Function, PacketHandler<any>[]> = new Map();

    constructor(serverSocket: SocketIO.Server);
    constructor(private serverSocket: Server) {
        this.serverSocket.on('connection', this.onConnection.bind(this));
    }

    private onConnection(socket: Socket) {
        socket.send('test');
        if ('handshake' in socket) {
            socket = socket as SocketIO.Socket;
            console.log(`[Packet] New connection on "${socket.handshake.url}"`);
        } else {
            socket = socket as SocketIOClient.Socket;
            console.log(`[Packet] New connection on "${socket.io.opts.hostname}"`);
        }
        this.knownSockets.set(socket.id, socket);
        for (const parser of this.parsers) {
            const messageHandler = (eventType: string, data: string) => {
                console.log(`[Packet] message: ${eventType}`);
                if (PacketManager.PACKET_MESSAGE_MATCHER.test(eventType)) {
                    eventType = eventType.match(PacketManager.PACKET_MESSAGE_MATCHER)[1];
                    if (eventType === parser[0].name) {
                        console.log(`[Packet] Reception "${eventType}"`);
                        const object = parser[1].parse(this.toArrayBuffer(data));
                        const handlerList = this.handlers.get(parser[0]) || [];
                        handlerList.forEach((handler: PacketHandler<Function>) => {
                            handler(socket, new PacketEvent(object));
                        });
                    }
                }
            };
            if ('handshake' in socket) {
                socket = socket as SocketIO.Socket;
                socket.on('message', messageHandler);
            } else {
                socket = socket as SocketIOClient.Socket;
                socket.on('message', messageHandler);
            }
        }
    }

    private toArrayBuffer(str: string): ArrayBuffer {
        const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        const bufView = new Uint16Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    private fromArrayBuffer(data: ArrayBuffer): string {
        return String.fromCharCode.apply(null, new Uint16Array(data));
    }

    public registerHandler<T>(type: {new (...argv: any[]): T}, handler: PacketHandler<T>): void {
        const handlerList = this.handlers.get(type) || [];
        handlerList.push(handler);
        this.handlers.set(type, handlerList);
    }

    public sendPacket<T>(socketid: string, type: {new (...argv: any[]): T}, data: T): void {
        if (this.parsers.get(type) && this.knownSockets.has(socketid)) {
            const parser = this.parsers.get(type);
            console.log(`[Packet] Sending: {socket #${socketid}} "${type.name}" ${data}`);
            this.knownSockets.get(socketid).send('packet:' + type.name,
                this.fromArrayBuffer(parser.serialize(data)));
        }
    }

    public registerParser<T>(type: {new (...argv: any[]): T}, parser: PacketParser<T>) {
        this.parsers.set(type, parser);
        for (let socket of this.knownSockets.values()) {
            const messageHandler = (eventType: string, data: string) => {
                console.log(`[Packet] message: ${eventType}`);
                if (PacketManager.PACKET_MESSAGE_MATCHER.test(eventType)) {
                    eventType = eventType.match(PacketManager.PACKET_MESSAGE_MATCHER)[1];
                    if (eventType === parser[0].name) {
                        console.log(`[Packet] Reception "${eventType}"`);
                        const object = parser[1].parse(data);
                        const handlerList = this.handlers.get(parser[0]) || [];
                        handlerList.forEach((handler: PacketHandler<Function>) => {
                            handler(socket, new PacketEvent(object));
                        });
                    }
                }
            };
            if ('handshake' in socket) {
                socket = socket as SocketIO.Socket;
                socket.on('message', messageHandler);
            } else {
                socket = socket as SocketIOClient.Socket;
                socket.on('message', messageHandler);
            }
        }
    }
}

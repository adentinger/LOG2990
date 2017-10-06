import * as SocketIO from 'socket.io';
import { PacketParser } from './';
import { Constructor, fromArrayBuffer } from '../../utils';
import { PacketManagerBase } from './packet-manager-base';

export class PacketManagerServer extends PacketManagerBase<SocketIO.Socket> {
    private readonly knownSockets: Map<string, SocketIO.Socket> = new Map();

    constructor(private serverSocket: SocketIO.Server) {
        super();
        this.register();
        this.serverSocket.on('connection', this.onConnection.bind(this));
    }

    private onConnection(socket: SocketIO.Socket) {
        console.log(`[Packet] New connection on "${socket.handshake.url}"`);
        this.knownSockets.set(socket.id, socket);
        for (const parserEntry of this.parsers) {
            this.registerParserToSocket(socket, parserEntry);
        }
    }

    public sendPacket<T>(type: Constructor<T>, data: T, socketid: string): boolean {
        if (this.parsers.has(type) && this.knownSockets.has(socketid)) {
            const parser = this.parsers.get(type);
            console.log(`[Packet] Sending: {socket "${socketid}"} "${type.name}" ${data}`);
            this.knownSockets.get(socketid).send('packet:' + type.name,
                fromArrayBuffer(parser.serialize(data)));
            return true;
        }
        return false;
    }

    public registerParser<T>(type: Constructor<T>, parser: PacketParser<T>) {
        console.log(`[Packet] Registering parser for ${type.name}`);
        this.parsers.set(type, parser);
        for (const socket of this.knownSockets.values()) {
            this.registerParserToSocket(socket, [type, parser]);
        }
    }
}

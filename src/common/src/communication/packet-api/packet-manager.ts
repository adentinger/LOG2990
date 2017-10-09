import * as SocketIO from 'socket.io';
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
        console.log(`[Packet] New connection on "${socket.handshake.url}" (id: ${socket.id})`);
        this.knownSockets.set(socket.id, socket);
        this.registerParsersToSocket(socket);
        socket.on('disconnect', () => {
            console.log(`[Packet] Disconnection (id: ${socket.id})`);
            this.knownSockets.delete(socket.id);
        });
    }

    public sendPacket<T>(type: Constructor<T>, data: T, socketid: string): boolean {
        if (this.parsers.has(type) && this.knownSockets.has(socketid)) {
            const parser = this.parsers.get(type);
            console.log(`[Packet] Sending: {socket "${socketid}"} "${type.name}" ${data}`);
            this.knownSockets.get(socketid).send('packet:' + type.name,
                fromArrayBuffer(parser.serialize(data)));
            return true;
        } else if (!this.parsers.has(type)) {
            console.warn(`No parser for packet with "${type.name}" type. Packet dropped`);
        }
        return false;
    }
}

import 'socket.io-client';
import { Constructor, fromArrayBuffer } from '../../utils';
import { PacketManagerBase } from './packet-manager-base';

export class PacketManagerClient extends PacketManagerBase<SocketIOClient.Socket> {
    constructor(private socket: SocketIOClient.Socket) {
        super();
        this.register();
        this.registerParsersToSocket(this.socket);
    }

    public sendPacket<T>(type: Constructor<T>, data: T): boolean {
        if (this.parsers.has(type)) {
            const parser = this.parsers.get(type);
            console.log(`[Packet] Sending: {to server} "${type.name}" ${data}`);
            this.socket.send('packet:' + type.name,
                fromArrayBuffer(parser.serialize(data)));
            return true;
        } else {
            console.warn(`No parser for packet with "${type.name}" type. Packet dropped`);
        }
        return false;
    }
}

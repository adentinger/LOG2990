try {
    require('socket.io-client');
} catch (err) {
    console.warn('The package "socket.io-client" is required to use PacketManagerClient');
}
import { PacketParser } from './';
import { Constructor, fromArrayBuffer } from '../../utils';
import { PacketManagerBase } from './packet-manager-base';

export class PacketManagerClient extends PacketManagerBase<SocketIOClient.Socket> {
    constructor(private socket: SocketIOClient.Socket) {
        super();
        this.register();
    }

    public sendPacket<T>(type: Constructor<T>, data: T): boolean {
        if (this.parsers.has(type)) {
            const parser = this.parsers.get(type);
            console.log(`[Packet] Sending: {to server} "${type.name}" ${data}`);
            this.socket.send('packet:' + type.name,
                fromArrayBuffer(parser.serialize(data)));
            return true;
        }
        return false;
    }

    public registerParser<T>(type: Constructor<T>, parser: PacketParser<T>): void {
        console.log(`[Packet] Registering parser for ${type.name}`);
        this.parsers.set(type, parser);
        this.registerParserToSocket(this.socket, [type, parser]);
    }
}

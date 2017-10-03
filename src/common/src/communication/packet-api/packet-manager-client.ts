import 'socket.io-client';
import { PacketParser } from './';
import { Constructor, fromArrayBuffer } from '../../utils';
import { PacketManagerBase } from './packet-manager-base';

export class PacketManagerClient extends PacketManagerBase<SocketIOClient.Socket> {
    constructor(private socket: SocketIOClient.Socket) {
        super();
        this.register();
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
        console.log(`[Packet] Registering parser ${type.name}`);
        this.parsers.set(type, parser);
        this.registerParserToSocket(this.socket, [type, parser]);
    }
}

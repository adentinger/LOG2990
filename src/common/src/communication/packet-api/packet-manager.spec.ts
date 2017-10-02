import { expect } from 'chai';
import * as io from 'socket.io';
import { PacketManager, PacketHandler } from './packet-manager';
import { createServer, ServerResponse, IncomingMessage } from 'http';
import { PacketParser } from './packet-parser';

class MockMessage {
    public title: string;
    public body: string;
}

class MockMessagePacketParser extends PacketParser<MockMessage> {
    public serialize(value: MockMessage): ArrayBuffer {
        const data = new ArrayBuffer(4 + value.title.length + 4 + value.body.length);
        const dataView = new DataView(data);
        dataView.setUint32(0, value.title.length);
        new Uint8Array(data, 4).set(value.title.split('').map(e => e.charCodeAt(0)));
        dataView.setUint32(4 + value.title.length, value.body.length);
        new Uint8Array(data, 8 + value.title.length).set(value.body.split('').map(e => e.charCodeAt(0)));
        return data;
    }
    public parse(data: ArrayBuffer): MockMessage {
        const value = new MockMessage();
        value.title = String.fromCharCode(...(new Uint8Array(data, 4).subarray(0, new Uint32Array(data, 0)[0])));
        value.body  = String.fromCharCode(...(new Uint8Array(data, 8 + value.title.length)
            .subarray(4 + value.title.length, new Uint32Array(data, value.title.length)[0])));
        return value;
    }
}

const SERV = createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log(req.read());
    req.socket.end();
    SERV.emit('packet:' + MockMessage, new MockMessagePacketParser().serialize({title: 'foo', body: 'bar'}));
}).listen(3000);

describe('PacketManager', () => {
    let server: SocketIO.Server;
    beforeEach((done) => {
        server = io(SERV);
        done();
    });

    afterEach((done) => {
        server.close();
        done();
    });

    it('shoud be created', (done) => {
        expect(new PacketManager(server)).to.not.be.null;
        done();
    });

    let packetManager: PacketManager;
    beforeEach((done) => {
        packetManager = new PacketManager(server);
        done();
    });

    it('should register a PacketParser', (done) => {
        const PARSER = new MockMessagePacketParser();
        packetManager.registerParser(MockMessage, PARSER);
        expect(packetManager['parsers'].values()).to.contain(PARSER);
        expect(packetManager['parsers'].keys()).to.contain(MockMessage);
        done();
    });
    xit('should register a PacketHandler', (done) => {
        const HANDLER: PacketHandler<any> = (event: any) => {console.log(event.constructor.name); };
        packetManager.registerHandler(MockMessage, HANDLER);
        expect(packetManager['handlers'].keys()).to.contain(MockMessage);
        expect(packetManager['handlers'].get(MockMessage)).to.contain(HANDLER);
        console.log('packet:' + MockMessage);
        expect(SERV.listeners('packet:' + MockMessage)).to.have.lengthOf(1);
        done();
    });
    xit('should call the right handler for the right event', (done) => {
        const PARSER = new MockMessagePacketParser();
        packetManager.registerParser(MockMessage, PARSER);
        packetManager.registerHandler(MockMessage, (event: any) => {console.log(event.constructor.name); done(); });
    });
});

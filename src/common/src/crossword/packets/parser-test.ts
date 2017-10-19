import { PacketParser, Parser } from '../../communication/packet-api/';

class PacketTest {
    constructor(
        public x: number,
        public flag: boolean,
        public str: string,
    ) { }
}

class PacketTestTop {
    constructor(
        public o1: PacketTest,
        public o2: PacketTest,
        public o3: PacketTest,

        public x: number,
        public flag: boolean,
        public str: string,
        public flag2: boolean) { }
}

@Parser(PacketTestTop)
class ParserTest extends PacketParser<PacketTestTop> {
    public serialize(packetTest: PacketTestTop): ArrayBuffer {
        return this.toArrayBuffer(packetTest);
    }
    public parse(buffer: ArrayBuffer): PacketTestTop {
        const properties = this.fromArrayBuffer(buffer);
        return this.fillProperties(properties, PacketTestTop);
    }
}

const p1 = new PacketTest(7, false, 'test');
const p2 = new PacketTest(7, false, 'test');
const p3: PacketTest = {
    x: 7,
    flag: true,
    str: 'test'
}

const top = new PacketTestTop(p1, p2, p3, 8, true, 'string', false);

const parser = new ParserTest()

const buffer = parser.serialize(top);
const parsed = parser.parse(buffer);

console.dir(parsed);

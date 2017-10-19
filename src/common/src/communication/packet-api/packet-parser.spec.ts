import { Parser, PacketParser } from '.';
import { PacketTest, PacketTestTop } from './parser-tests/packet-test.packet';
import { expect } from 'chai';


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

describe('PacketParser', () => {
    it('can parse the instance of a class with valid attributes', (done) => {
        const p1 = new PacketTest(7, false, 'test');
        const p2 = new PacketTest(7, false, 'test');
        const p3: PacketTest = {
            x: 7,
            flag: true,
            str: 'test'
        };

        const top = new PacketTestTop(p1, p2, p3, 8, true, 'string', false);

        const parser = new ParserTest();

        const buffer = parser.serialize(top);
        console.log('');
        const parsed = parser.parse(buffer);
        expect(parsed).to.deep.equal(top);
        done();
    });
});

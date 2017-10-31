import { Parser, PacketParser, SIZE_UINT32, SIZE_UINT16, SIZE_UINT8 } from '../../index';
import { WordTryResultPacket } from './word-try-result.packet';

@Parser(WordTryResultPacket)
export class WordTryResultParser extends PacketParser<WordTryResultPacket> {

    public serialize(value: WordTryResultPacket): ArrayBuffer {
        let dataLength = SIZE_UINT8;
        if (value.found) {
            dataLength += SIZE_UINT16 * value.word.string.length;
        }
        const BUFFER: ArrayBuffer = new ArrayBuffer(dataLength);
        const DATA = new DataView(BUFFER);

        DATA.setUint8(0, value.found ? 1 : 0);
        if (value.found) {
            const STRING_LENGTH = value.word.string.length;
            DATA.setInt32(SIZE_UINT8 + 0 * SIZE_UINT32, value.word.id);
            DATA.setInt32(SIZE_UINT8 + 1 * SIZE_UINT32, value.word.y);
            DATA.setInt32(SIZE_UINT8 + 2 * SIZE_UINT32, value.word.x);
            // Be careful: this length is different from the actual string length
            DATA.setInt32(SIZE_UINT8 + 3 * SIZE_UINT32, value.word.length);
            DATA.setInt32(SIZE_UINT8 + 4 * SIZE_UINT32, value.word.direction);
            DATA.setInt32(SIZE_UINT8 + 5 * SIZE_UINT32, value.word.owner);
            DATA.setInt32(SIZE_UINT8 + 6 * SIZE_UINT32, STRING_LENGTH);

            for (let i = 0; i < STRING_LENGTH; i++) {
                DATA.setUint16(
                    SIZE_UINT8 + 7 * SIZE_UINT32 + i * SIZE_UINT16,
                    value.word.string.charCodeAt(i)
                );
            }
        }
        return BUFFER;
    }

    public parse(data: ArrayBuffer): WordTryResultPacket {
        const VIEW = new DataView(data);
        const PACKET = new WordTryResultPacket();
        PACKET.found = VIEW.getUint8(0) !== 0 ? true : false;
        if (PACKET.found) {
            // TODO
            PACKET.word = null;
        }
        else {
            PACKET.word = null;
        }
        return null;
    }

}

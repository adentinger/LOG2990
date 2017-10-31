import { Parser, PacketParser, SIZE_UINT32, SIZE_UINT16 } from '../../index';
import { WordTryResultPacket } from './word-try-result.packet';
import { GridWord } from '../grid-word';
import { GridWordParseUtil } from './utils/grid-word-parse-util';

@Parser(WordTryResultPacket)
export class WordTryResultParser extends PacketParser<WordTryResultPacket> {

    public serialize(value: WordTryResultPacket): ArrayBuffer {
        let dataLength;
        if (value.found) {
            dataLength = 8 * SIZE_UINT32 + SIZE_UINT16 * value.word.string.length;
        }
        else {
            dataLength = SIZE_UINT32;
        }
        const BUFFER: ArrayBuffer = new ArrayBuffer(dataLength);
        const DATA = new DataView(BUFFER);

        DATA.setUint8(0, value.found ? 1 : 0);
        if (value.found) {
            GridWordParseUtil.serializeToBuffer(value.word, BUFFER, SIZE_UINT32);
        }
        console.log(value);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): WordTryResultPacket {
        const VIEW = new DataView(data);
        const PACKET = new WordTryResultPacket();
        PACKET.found = VIEW.getUint8(0) !== 0 ? true : false;
        if (PACKET.found) {
            PACKET.word = GridWordParseUtil.parseFromBuffer(data, SIZE_UINT32);
        }
        else {
            PACKET.word = null;
        }
        return PACKET;
    }

}

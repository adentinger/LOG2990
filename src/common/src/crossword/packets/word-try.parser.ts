import { PacketParser } from '../../communication/packet-api';
import { Parser, SIZE_UINT16, SIZE_UINT32 } from '../../communication/packet-api/packet-handler';
import { WordTryPacket } from './word-try.packet';
import { GridWordParseUtil } from './utils/grid-word-parse-util';

@Parser(WordTryPacket)
export class WordTryParser extends PacketParser<WordTryPacket> {

    public serialize(value: WordTryPacket): ArrayBuffer {
        const WORD_ANSWER_LENGTH = value.wordTry.string.length;
        const BUFFER: ArrayBuffer = new ArrayBuffer(7 * SIZE_UINT32 + WORD_ANSWER_LENGTH * SIZE_UINT16);
        GridWordParseUtil.serializeToBuffer(value.wordTry, BUFFER, 0);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): WordTryPacket {
        return new WordTryPacket(GridWordParseUtil.parseFromBuffer(data, 0));
    }

}

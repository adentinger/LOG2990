import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { WordTryPacket } from './word-try.packet';
import { GridWordParseUtil } from './utils/grid-word-parse-util';

@Parser(WordTryPacket)
export class WordTryParser extends PacketParser<WordTryPacket> {

    public serialize(value: WordTryPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(GridWordParseUtil.bufferSizeOf(value.wordTry));
        GridWordParseUtil.serializeToBuffer(value.wordTry, BUFFER, 0);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): WordTryPacket {
        return new WordTryPacket(GridWordParseUtil.parseFromBuffer(data, 0));
    }

}

import { Parser, PacketParser } from '../../index';
import { WordTryResultPacket } from './word-try-result.packet';

@Parser(WordTryResultPacket)
export class WordTryResultParser extends PacketParser<WordTryResultPacket> {

    public serialize(value: WordTryResultPacket): ArrayBuffer {
        return null;
    }

    public parse(data: ArrayBuffer): WordTryResultPacket {
        return null;
    }

}

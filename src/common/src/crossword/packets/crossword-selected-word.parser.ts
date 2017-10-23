import { Parser, PacketParser } from '../../index';
import { CrosswordSelectedWordPacket } from './crossword-selected-word.packet';

@Parser(CrosswordSelectedWordPacket)
export class CrosswordSelectedWordParser extends PacketParser<CrosswordSelectedWordPacket> {

    public serialize(value: CrosswordSelectedWordPacket): ArrayBuffer {
        return null;
    }

    public parse(data: ArrayBuffer): CrosswordSelectedWordPacket {
        return null;
    }

}

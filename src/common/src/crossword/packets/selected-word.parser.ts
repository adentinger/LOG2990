import { Parser, PacketParser, SIZE_UINT32 } from '../../index';
import { SelectedWord } from '../selected-word';

@Parser(SelectedWord)
export class SelectedWordParser extends PacketParser<SelectedWord> {

    public serialize(value: SelectedWord): ArrayBuffer {
        const BUFFER = new ArrayBuffer(2 * SIZE_UINT32);
        const DATA = new DataView(BUFFER);
        DATA.setInt32(0 * SIZE_UINT32, value.direction);
        DATA.setInt32(1 * SIZE_UINT32, value.direction);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): SelectedWord {
        const WORD = new SelectedWord();
        const VIEW = new DataView(data);
        WORD.direction = VIEW.getInt32(0 * SIZE_UINT32);
        WORD.index     = VIEW.getInt32(1 * SIZE_UINT32);
        return null;
    }

}

import { PacketParser } from '../../communication/packet-api';
import { Parser, SIZE_UINT16, SIZE_UINT32 } from '../../communication/packet-api/packet-handler';
import { WordTryPacket } from './word-try.packet';
import { GridWord } from '../grid-word';


@Parser(WordTryPacket)
export class GameJoinParser extends PacketParser<WordTryPacket> {
    public serialize(value: WordTryPacket): ArrayBuffer {
        const WORD_ANSWER_LENGTH = value.wordTry.string.length;
        const BUFFER: ArrayBuffer = new ArrayBuffer(6 * SIZE_UINT32 + WORD_ANSWER_LENGTH * SIZE_UINT16);
        const DATA = new DataView(BUFFER);

        DATA.setInt32(0 * SIZE_UINT32, value.wordTry.y);
        DATA.setInt32(1 * SIZE_UINT32, value.wordTry.x);
        DATA.setInt32(2 * SIZE_UINT32, value.wordTry.length);
        DATA.setInt32(3 * SIZE_UINT32, value.wordTry.direction);
        DATA.setInt32(4 * SIZE_UINT32, value.wordTry.owner);
        DATA.setInt32(5 * SIZE_UINT32, WORD_ANSWER_LENGTH);
        for (let i = 0; i < WORD_ANSWER_LENGTH; i++) {
            DATA.setUint16(6 * SIZE_UINT32 + SIZE_UINT16 * i, value.wordTry.string.charCodeAt(i));
        }

        return BUFFER;
    }

    public parse(data: ArrayBuffer): WordTryPacket {
        const VIEW = new DataView(data);
        const Y = VIEW.getInt32(0);
        const X = VIEW.getInt32(0 + SIZE_UINT32);
        const WORD_LENGTH = VIEW.getInt32(0 + 2 * SIZE_UINT32);
        const WORD_DIRECTION = VIEW.getInt32(0 + 3 * SIZE_UINT32);
        const WORD_OWNER = VIEW.getInt32(0 + 4 * SIZE_UINT32);
        const WORD_ANSWER_LENGTH = VIEW.getInt32(0 + 5 * SIZE_UINT32);
        let buffer = '';
        for (let i = 0; i < WORD_ANSWER_LENGTH; i++) {
            buffer += String.fromCharCode(VIEW.getUint16(i * SIZE_UINT16 + 6 * SIZE_UINT32));
        }

        const newGridWord: GridWord = new GridWord();
        newGridWord.y = Y;
        newGridWord.x = X;
        newGridWord.length = WORD_LENGTH;
        newGridWord.direction = WORD_DIRECTION;
        newGridWord.owner = WORD_OWNER;
        newGridWord.string = buffer;

        return new WordTryPacket(newGridWord);
    }
}

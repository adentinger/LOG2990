import { Parser, PacketParser, SIZE_UINT32, SIZE_UINT16 } from '../../index';
import { WordTryResultPacket } from './word-try-result.packet';
import { GridWord } from '../grid-word';

@Parser(WordTryResultPacket)
export class WordTryResultParser extends PacketParser<WordTryResultPacket> {

    public serialize(value: WordTryResultPacket): ArrayBuffer {
        console.log('HERE');
        let dataLength;
        if (value.found) {
            dataLength = 8 * SIZE_UINT32 + SIZE_UINT16 * value.word.string.length;
        }
        else {
            dataLength = SIZE_UINT32;
        }
        const BUFFER: ArrayBuffer = new ArrayBuffer(dataLength);
        const DATA = new DataView(BUFFER);
        console.log('HERE', value);

        DATA.setUint8(0, value.found ? 1 : 0);
        console.log('HERE', value.found);
        if (value.found) {
            console.log('NOW HERE');
            const STRING_LENGTH = value.word.string.length;
            DATA.setInt32(1 * SIZE_UINT32, value.word.id);
            DATA.setInt32(2 * SIZE_UINT32, value.word.y);
            DATA.setInt32(3 * SIZE_UINT32, value.word.x);
            console.log('HERE');
            // Be careful: this length is different from the actual string length
            DATA.setInt32(4 * SIZE_UINT32, value.word.length);
            DATA.setInt32(5 * SIZE_UINT32, value.word.direction);
            DATA.setInt32(6 * SIZE_UINT32, value.word.owner);
            DATA.setInt32(7 * SIZE_UINT32, STRING_LENGTH);

            console.log('HERE');
            for (let i = 0; i < STRING_LENGTH; i++) {
                DATA.setUint16(
                    8 * SIZE_UINT32 + i * SIZE_UINT16,
                    value.word.string.charCodeAt(i)
                );
                console.log('HERE');
            }
            console.log('THERE');
        }
        console.log(value);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): WordTryResultPacket {
        const VIEW = new DataView(data);
        const PACKET = new WordTryResultPacket();
        PACKET.found = VIEW.getUint8(0) !== 0 ? true : false;
        if (PACKET.found) {
            PACKET.word = new GridWord();
            PACKET.word.id = VIEW.getInt32(1 * SIZE_UINT32);
            PACKET.word.y  = VIEW.getInt32(2 * SIZE_UINT32);
            PACKET.word.x  = VIEW.getInt32(3 * SIZE_UINT32);
            console.log('HERE');
            // Be careful: this length is different from the actual string length
            PACKET.word.length    = VIEW.getInt32(4 * SIZE_UINT32);
            PACKET.word.direction = VIEW.getInt32(5 * SIZE_UINT32);
            PACKET.word.owner     = VIEW.getInt32(6 * SIZE_UINT32);
            const STRING_LENGTH   = VIEW.getInt32(7 * SIZE_UINT32);
            let buffer = '';
            for (let i = 0; i < STRING_LENGTH; i++) {
                buffer += String.fromCharCode(VIEW.getUint16(i * SIZE_UINT16 + 8 * SIZE_UINT32));
            }
            PACKET.word.string = buffer;
        }
        else {
            PACKET.word = null;
        }
        return PACKET;
    }

}

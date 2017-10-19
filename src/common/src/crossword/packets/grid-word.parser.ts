import { PacketParser } from '../../communication/packet-api';
import { Parser, SIZE_UINT16, SIZE_UINT32 } from '../../communication/packet-api/packet-handler';
import { GridWordPacket } from './grid-word.packet';
import { GridWord } from '../grid-word';

@Parser(GridWordPacket)
export class GridWordParser extends PacketParser<GridWordPacket> {
    public serialize(value: GridWordPacket): ArrayBuffer {
        const STRING_LENGTH = value.gridword.string.length;
        const BUFFER: ArrayBuffer = new ArrayBuffer(7 * SIZE_UINT32 + STRING_LENGTH * SIZE_UINT16);
        const DATA = new DataView(BUFFER);

        DATA.setInt32(0 * SIZE_UINT32, value.gridword.id);
        DATA.setInt32(1 * SIZE_UINT32, value.gridword.y);
        DATA.setInt32(2 * SIZE_UINT32, value.gridword.x);
        // Be careful: this length is different from the actual string length
        DATA.setInt32(3 * SIZE_UINT32, value.gridword.length);
        DATA.setInt32(4 * SIZE_UINT32, value.gridword.direction);
        DATA.setInt32(5 * SIZE_UINT32, value.gridword.owner);
        DATA.setInt32(6 * SIZE_UINT32, STRING_LENGTH);

        for (let i = 0; i < STRING_LENGTH; i++) {
            DATA.setUint16(7 * SIZE_UINT32 + i * SIZE_UINT16, value.gridword.string.charCodeAt(i));
        }
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GridWordPacket {
        const VIEW = new DataView(data);
        const id: number = VIEW.getInt32(0 * SIZE_UINT32);
        const y: number = VIEW.getInt32(1 * SIZE_UINT32);
        const x: number = VIEW.getInt32(2 * SIZE_UINT32);
        const length: number = VIEW.getInt32(3 * SIZE_UINT32);
        const direction: number = VIEW.getInt32(4 * SIZE_UINT32);
        const owner: number = VIEW.getInt32(5 * SIZE_UINT32);
        const stringLength: number = VIEW.getInt32(6 * SIZE_UINT32);

        let buffer = '';

        for (let i = 0; i < stringLength; i++) {

            buffer += String.fromCharCode(VIEW.getUint16(7 * SIZE_UINT32 + i * SIZE_UINT16));
        }

        const newGridWord = new GridWord(id, y, x, length, direction, owner, buffer);
        return new GridWordPacket(newGridWord);
    }
}

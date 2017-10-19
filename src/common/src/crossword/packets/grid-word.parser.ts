import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { GridWordPacket } from './grid-word.packet';
import { GridWord } from '../grid-word';

const SIZE_UINT8 = 1,
    SIZE_UINT16 = 2,
    SIZE_UINT32 = 4;

@Parser(GridWordPacket)
export class GameJoinParser extends PacketParser<GridWordPacket> {
    public serialize(value: GridWordPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(6 * SIZE_UINT32 + value.gridword.length * SIZE_UINT16);
        const DATA = new DataView(BUFFER);

        DATA.setFloat32(0 * SIZE_UINT32, value.gridword.id);
        DATA.setFloat32(1 * SIZE_UINT32, value.gridword.y);
        DATA.setFloat32(2 * SIZE_UINT32, value.gridword.x);
        DATA.setFloat32(3 * SIZE_UINT32, value.gridword.length);
        DATA.setFloat32(4 * SIZE_UINT32, value.gridword.direction);
        DATA.setFloat32(0 * SIZE_UINT32, value.gridword.owner);

        for (let i = 0; i < value.gridword.length; i++) {
            DATA.setInt16(i + 6 * SIZE_UINT32, value.gridword.string.charCodeAt(i))
        }
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GridWordPacket {
        const VIEW = new DataView(data);
        // const LENGTH = VIEW.getInt32(0);
        const id: number = VIEW.getInt32(0 * SIZE_UINT32);
        const y: number = VIEW.getInt32(1 * SIZE_UINT32);
        const x: number = VIEW.getInt32(2 * SIZE_UINT32);
        const length: number = VIEW.getInt32(3 * SIZE_UINT32);
        const direction: number = VIEW.getInt32(4 * SIZE_UINT32);
        const owner: number = VIEW.getInt32(5 * SIZE_UINT32);

        let buffer = '';

        for (let i = 0; i < length; i++) {
            buffer += String.fromCharCode(VIEW.getUint8(i + SIZE_UINT32));
        }

        const newGridWord = new GridWord(id, y, x, length, direction, owner, buffer);
        return new GridWordPacket(newGridWord);
    }
}

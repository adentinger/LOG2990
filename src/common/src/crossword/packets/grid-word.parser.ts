import { PacketParser } from '../../communication/packet-api';
import { Parser, SIZE_UINT16, SIZE_UINT32 } from '../../communication/packet-api/packet-handler';
import { GridWordPacket } from './grid-word.packet';
import { GridWordParseUtil } from './utils/grid-word-parse-util';

@Parser(GridWordPacket)
export class GridWordParser extends PacketParser<GridWordPacket> {

    public serialize(value: GridWordPacket): ArrayBuffer {
        const STRING_LENGTH = value.gridword.string.length;
        const BUFFER: ArrayBuffer = new ArrayBuffer(7 * SIZE_UINT32 + STRING_LENGTH * SIZE_UINT16);
        GridWordParseUtil.serializeToBuffer(value.gridword, BUFFER, 0);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GridWordPacket {
        return new GridWordPacket(GridWordParseUtil.parseFromBuffer(data, 0));
    }

}

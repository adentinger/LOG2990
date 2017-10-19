import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { CrosswordTimerPacket } from './crossword-timer.packet';

const SIZE_UINT8 = 1, SIZE_UINT16 = 2, SIZE_UINT32 = 4;

@Parser(CrosswordTimerPacket)
export class GameJoinParser extends PacketParser<CrosswordTimerPacket> {
    public serialize(value: CrosswordTimerPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(1 * SIZE_UINT32);
        const DATA = new DataView(BUFFER);

        DATA.setInt32(0 * SIZE_UINT32, value.countdown);

        return BUFFER;
    }

    public parse(data: ArrayBuffer): CrosswordTimerPacket {
        const VIEW = new DataView(data);

        const countdown = VIEW.getInt32(0);

        return new CrosswordTimerPacket(countdown);
    }
}

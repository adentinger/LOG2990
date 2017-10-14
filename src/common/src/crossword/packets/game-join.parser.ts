import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { GameJoinPacket } from './game-join.packet';

const SIZE_UINT8 = 1,
    SIZE_UINT32 = 4;
// Example of an implementation of a Packet for the class WorkConstraint
@Parser(GameJoinPacket)
export class GameJoinParser extends PacketParser<GameJoinPacket> {
    public serialize(value: GameJoinPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(SIZE_UINT32 + value.gameId.length * SIZE_UINT8);
        const DATA = new DataView(BUFFER);
        DATA.setInt32(0, value.gameId.length);
        for (let i = 0; i < value.gameId.length; i++) {
            DATA.setUint8(i + SIZE_UINT32, value.gameId.charCodeAt(i));
        }
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GameJoinPacket {
        const VIEW = new DataView(data);
        const LENGTH = VIEW.getInt32(0);
        let buffer: string = '';
        for (let i = 0; i < LENGTH; i++) {
            buffer += String.fromCharCode(VIEW.getUint8(i + SIZE_UINT32));
        }
        return new GameJoinPacket(buffer);
    }
}

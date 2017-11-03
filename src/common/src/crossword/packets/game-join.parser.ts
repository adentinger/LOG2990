import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { GameJoinPacket } from './game-join.packet';
import { SIZE_UINT32 } from '../../index';

@Parser(GameJoinPacket)
export class GameJoinParser extends PacketParser<GameJoinPacket> {

    public serialize(value: GameJoinPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(SIZE_UINT32);
        const DATA = new DataView(BUFFER);
        DATA.setUint32(0, value.gameId);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GameJoinPacket {
        const VIEW = new DataView(data);
        const GAME_ID = VIEW.getUint32(0);
        return new GameJoinPacket(GAME_ID);
    }

}

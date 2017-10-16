import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { GameDefinitionPacket } from './game-definition.packet';
import { Definition } from '../definition';

const SIZE_UINT8 = 1, SIZE_UINT32 = 4;

@Parser(GameDefinitionPacket)
export class GameJoinParser extends PacketParser<GameDefinitionPacket> {
    public serialize(value: GameDefinitionPacket): ArrayBuffer {
        const DEFINITION_TEXT_LENGTH = value.definition.text.length;
        const BUFFER: ArrayBuffer = new ArrayBuffer(SIZE_UINT32 + DEFINITION_TEXT_LENGTH * SIZE_UINT8);
        const DATA = new DataView(BUFFER);

        DATA.setInt32(0, value.index);
        DATA.setInt32(0 + SIZE_UINT32, DEFINITION_TEXT_LENGTH);
        for (let i = 0; i < DEFINITION_TEXT_LENGTH; i++) {
            DATA.setUint8(i + 2 * SIZE_UINT32, value.definition.text.charCodeAt(i));
        }
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GameDefinitionPacket {
        const VIEW = new DataView(data);
        const INDEX = VIEW.getInt32(0);
        const DEFINITION_TEXT_LENGTH = VIEW.getInt32(0 + SIZE_UINT32);

        let buffer = '';
        for (let i = 0; i < DEFINITION_TEXT_LENGTH; i++) {
            buffer += String.fromCharCode(VIEW.getUint8(i + 2 * SIZE_UINT32));
        }
        return new GameDefinitionPacket(INDEX, new Definition(buffer));
    }
}

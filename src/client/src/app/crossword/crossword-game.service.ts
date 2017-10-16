import { Injectable } from '@angular/core';

import { CrosswordGame } from './class/crossword-game';
import { CROSSWORD_GAME } from './mocks/crossword-game-mock';
import { PacketManagerClient } from '../packet-manager-client';
import { GameJoinPacket } from '../common/crossword/packets/game-join.packet';
import { registerHandlers, PacketHandler, PacketEvent } from '../common/index';
import { GameDefinitionPacket } from '../common/crossword/packets/game-definition.packet';

@Injectable()
export class CrosswordGameService {

    private gameId: string = null;

    public selectedWordIndex = 0;
    public aDefinitionIsSelected = false;

    public crosswordGame: CrosswordGame = CROSSWORD_GAME;

    public constructor(private packetManager: PacketManagerClient) {
        registerHandlers(this, this.packetManager);
    }

    public getCurrentGame(): CrosswordGame {
        return this.crosswordGame;
    }
    public setGameId(id: string): void {
        if (!this.gameId) {
            this.gameId = id;
            // use packetmanager to join this game
            this.packetManager.sendPacket(GameJoinPacket, new GameJoinPacket(this.gameId));
        }
    }

    @PacketHandler(GameJoinPacket)
    public gameDefinitionHandler(event: PacketEvent<GameDefinitionPacket>) {
        const definitionIndex = event.value.index;
        const definition = event.value.definition;

        // TODO update game definitions with incomming definition
    }
}

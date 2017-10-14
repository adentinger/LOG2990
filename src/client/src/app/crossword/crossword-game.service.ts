import { Injectable } from '@angular/core';

import { CrosswordGame } from './class/crossword-game';
import { CROSSWORD_GAME } from './mocks/crossword-game-mock';
import { PacketManagerClient } from '../packet-manager-client';
import { GameJoinPacket } from '../common/crossword/packets/game-join.packet';

@Injectable()
export class CrosswordGameService {

    private gameId: string = null;


    public selectedWordIndex = 0;
    public aDefinitionIsSelected = false;

    public crosswordGame: CrosswordGame = CROSSWORD_GAME;

    public constructor(private packetManager: PacketManagerClient) { }
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
}

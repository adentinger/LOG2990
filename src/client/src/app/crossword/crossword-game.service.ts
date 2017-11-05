import { Injectable } from '@angular/core';

import { CrosswordGame } from './class/crossword-game';
import { mockCrosswordGame } from './mocks/crossword-game-mock';
import { PacketManagerClient } from '../packet-manager-client';
import { GameJoinPacket } from '../../../../common/src/crossword/packets/game-join.packet';
import '../../../../common/src/crossword/packets/crossword-timer.parser';

/**
 * @class CrosswordGameService
 * Has the purpose of sending all packets from the client to the server
 * The response from the server usually goes directly to the appropriate
 * service
 */
@Injectable()
export class CrosswordGameService {

    private cheatModeOn = false;
    private showWordsOn = false;
    private changeTimerValueOn = false;

    private gameId: number = null;

    private crosswordGame: CrosswordGame = mockCrosswordGame();

    public constructor(private packetManager: PacketManagerClient) { }

    public getCurrentGame(): CrosswordGame {
        return this.crosswordGame;
    }

    public joinGame(id: number): void {
        if (!this.gameId) {
            this.gameId = id;
            // use packetmanager to join this game
            console.log('setting id to', id);
            this.packetManager.sendPacket(GameJoinPacket, new GameJoinPacket(this.gameId));
        }
    }

    public setCheatModeOnOff(): void {
        this.cheatModeOn = !this.cheatModeOn;
    }

    public getCheatModeState(): boolean {
        return this.cheatModeOn;
    }

    public setShowWordsOnOff(): void {
        this.showWordsOn = !this.showWordsOn;
    }

    public getShowWordsState(): boolean {
        return this.showWordsOn;
    }

    public setTimerOnOff(): void {
        this.changeTimerValueOn = !this.changeTimerValueOn;
    }

    public getTimerState(): boolean {
        return this.changeTimerValueOn;
    }

}

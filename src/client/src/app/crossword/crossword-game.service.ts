import { Injectable } from '@angular/core';

import { CrosswordGame } from './class/crossword-game';
import { CROSSWORD_GAME } from './mocks/crossword-game-mock';
import { PacketManagerClient } from '../packet-manager-client';
import { GameJoinPacket } from '../../../../common/src/crossword/packets/game-join.packet';
import { CrosswordTimerPacket } from '../../../../common/src/crossword/packets/crossword-timer.packet';
import { Direction } from '../../../../common/src/crossword/crossword-enums';
import '../../../../common/src/crossword/packets/crossword-timer.parser';

const TIME_MAX = 3600000; // 1 hour

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

    private gameId: string = null;

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

    public changeTimerValue(seconds: string) {
        let time = Number(seconds);
        if (Number.isNaN(time)) {
            time = TIME_MAX;
        }

        this.packetManager.sendPacket(CrosswordTimerPacket, new CrosswordTimerPacket(time));
    }
}

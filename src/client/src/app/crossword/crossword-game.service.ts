import { Injectable } from '@angular/core';

import { CrosswordGame } from './class/crossword-game';
import { CROSSWORD_GAME } from './mocks/crossword-game-mock';
import { PacketManagerClient } from '../packet-manager-client';
import { GameJoinPacket } from '../common/crossword/packets/game-join.packet';
import { registerHandlers, PacketHandler, PacketEvent } from '../common/index';
import { GameDefinitionPacket } from '../common/crossword/packets/game-definition.packet';
import { CrosswordTimerPacket } from '../common/crossword/packets/crossword-timer.packet';
import '../common/crossword/packets/crossword-timer.parser';

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
    private changeTimerValueOn = false;
    private timerValueInSeconds: number;

    private gameId: string = null;

    public selectedWordIndex = 0;
    public lastSelectedWordIndex = 0;
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

    public getShowWordsState(): boolean {
        return this.cheatModeOn;
    }

    public getShowWordsStateText(): string {
        if (this.cheatModeOn) {
            return 'Hide words';
        }
        else {
            return 'Show words';
        }
    }

    public setShowWordsOnOff(): void {
        this.cheatModeOn = !this.cheatModeOn;
    }

    public getTimerState(): boolean {
        return this.changeTimerValueOn;
    }

    public getTimerStateText(): string {
        if (this.changeTimerValueOn) {
            return 'Disable';
        }
        else {
            return 'Set time';
        }
    }

    public setTimerOnOff(): void {
        this.changeTimerValueOn = !this.changeTimerValueOn;
    }

    public changeTimerValue(seconds: string) {
        let time = Number(seconds);
        if (Number.isNaN(time)) {
            time = TIME_MAX;
        }

        this.packetManager.sendPacket(CrosswordTimerPacket, new CrosswordTimerPacket(time));
    }
}

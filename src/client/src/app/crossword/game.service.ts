import { Injectable } from '@angular/core';

import { CrosswordGame } from './class/crossword-game';
import { mockCrosswordGame } from './mocks/crossword-game-mock';
import { PacketManagerClient } from '../packet-manager-client';

import { GameJoinPacket } from '../../../../common/src/crossword/packets/game-join.packet';
import '../../../../common/src/crossword/packets/game-join.parser';
import { Subject } from 'rxjs/Subject';

/**
 * @class GameService
 * Represents the current game. Has the resposibilities of:
 * 1) Containing the game's data
 * 2) Sending all socket packets from the client to the server
 * The response from the server usually goes directly to the appropriate
 * service
 */
@Injectable()
export class GameService {

    private cheatModeOn = false;
    private isShowWordsOnInternal = false;
    private onShowWordsInternal = new Subject<boolean>();
    private changeTimerValueOn = false;

    private gameId: number = null;
    private playerName = '';

    private crosswordGame: CrosswordGame = mockCrosswordGame();

    public constructor(private packetManager: PacketManagerClient) {
        this.onShowWordsInternal.subscribe((value) => {
            this.isShowWordsOnInternal = value;
        });
    }

    public getCurrentGame(): CrosswordGame {
        return this.crosswordGame;
    }

    public joinGame(id: number, playerName): void {
        if (!this.gameId) {
            this.gameId = id;
            this.playerName = playerName;
            // use packetmanager to join this game
            console.log('setting id to', id);
            this.packetManager.sendPacket(
                GameJoinPacket,
                new GameJoinPacket(this.gameId, this.playerName)
            );
        }
    }

    public setCheatModeOnOff(): void {
        this.cheatModeOn = !this.cheatModeOn;
    }

    public getCheatModeState(): boolean {
        return this.cheatModeOn;
    }

    public isShowWordsOn(): boolean {
        return this.isShowWordsOnInternal;
    }

    public get onShowWords(): Subject<boolean> {
        return this.onShowWordsInternal;
    }

    public setTimerOnOff(): void {
        this.changeTimerValueOn = !this.changeTimerValueOn;
    }

    public getTimerState(): boolean {
        return this.changeTimerValueOn;
    }

}

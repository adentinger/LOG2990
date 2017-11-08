import { Injectable } from '@angular/core';

import { PacketManagerClient } from '../packet-manager-client';

import { GameJoinPacket } from '../../../../common/src/crossword/packets/game-join.packet';
import '../../../../common/src/crossword/packets/game-join.parser';
import { Subject } from 'rxjs/Subject';
import { GameId } from '../../../../common/src/communication/game-configs';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../common/src/index';

export enum GameState {
    configuring,
    started,
    finished
}

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

    public state = GameState.configuring;

    private cheatModeOn = false;
    private isShowWordsOnInternal = false;
    private onShowWordsInternal = new Subject<boolean>();
    private changeTimerValueOn = false;

    private gameIdInternal: number = null;
    private playerNameInternal = 'Dylan Farvacque';
    private opponentNameInternal = 'CHUCK NORRIS';

    public get playerName(): string {
        return this.playerNameInternal;
    }

    public get opponentName(): string {
        return this.opponentNameInternal;
    }

    public constructor(private packetManager: PacketManagerClient) {
        this.onShowWordsInternal.subscribe((value) => {
            this.isShowWordsOnInternal = value;
        });
        registerHandlers(this, packetManager);
    }

    public joinGame(id: number, playerName: string): void {
        if (!this.gameIdInternal) {
            this.gameIdInternal = id;
            this.playerNameInternal = playerName;
            this.packetManager.sendPacket(
                GameJoinPacket,
                new GameJoinPacket(this.gameIdInternal, this.playerNameInternal)
            );
        }
    }

    public finishGame(wordsFound: number, opponentWordsFound: number): void {
        let message: string;
        if (wordsFound > opponentWordsFound) {
            message = 'Congratulations ; you win!';
        }
        else {
            message = 'Congratulations ; you (almost) won!';
        }
        alert(message);
    }

    public get gameId(): GameId {
        return this.gameIdInternal;
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

    @PacketHandler(GameJoinPacket)
    private opponentJoined(event: PacketEvent<GameJoinPacket>): void {
        console.log(`OPPONENT ${event.value.playerName} joined`);
    }

}

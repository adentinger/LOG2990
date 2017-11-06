import { Injectable } from '@angular/core';

import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { GameId, CrosswordGameConfigs, PlayerNumber } from '../../../../../common/src/communication/game-configs';

export enum CreateOrJoin {
    create,
    join
}

/**
 * @class UserChoiceService
 * @description Has the responsibility of containing the choices of the user.
 */
@Injectable()
export class UserChoiceService {

    public gameMode: GameMode;
    public playerNumber: PlayerNumber;
    public createOrJoin: CreateOrJoin;
    public difficulty: Difficulty;
    public gameId: GameId;
    public playerName: string;

    constructor() { }

    public toGameConfiguration(): CrosswordGameConfigs {
        return {
            gameMode: this.gameMode,
            difficulty: this.difficulty,
            gameId: this.gameId,
            playerNumber: this.playerNumber
        };
    }

}

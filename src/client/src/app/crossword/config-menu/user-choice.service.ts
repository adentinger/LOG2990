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
    public chosenGame: GameId;
    public playerName = '';

    constructor() { }

    public finalize(): void {
        delete this.gameMode;
        delete this.chosenGame;
        delete this.createOrJoin;
        delete this.difficulty;
        delete this.playerName;
        delete this.playerNumber;
    }

    public toGameConfiguration(): CrosswordGameConfigs {
        return {
            gameMode: this.gameMode,
            difficulty: this.difficulty,
            playerNumber: this.playerNumber
        };
    }

}

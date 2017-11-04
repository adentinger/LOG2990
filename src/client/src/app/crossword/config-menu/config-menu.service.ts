import { Injectable } from '@angular/core';

import { GameMode, CreateOrJoin, Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { PlayerNumber, GameId } from '../../../../../common/src/communication/game-configs';

export interface GameConfiguration {
    gameMode: GameMode;
    numberOfPlayers: PlayerNumber;
    createOrJoin: CreateOrJoin;
    gameToJoin: GameId;
    difficulty: Difficulty;
}

@Injectable()
export class ConfigMenuService {

    constructor() { }

}

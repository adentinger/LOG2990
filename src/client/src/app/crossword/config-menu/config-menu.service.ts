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

/**
 * @class ConfigMenuService
 * @description Handles sending the configuration to the server.
 */
@Injectable()
export class ConfigMenuService {

    constructor() { }

}

import { Injectable } from '@angular/core';

import { CrosswordGame } from './class/crossword-game';
import { CROSSWORD_GAME } from './mocks/crossword-game-mock';

@Injectable()
export class CrosswordGameService {

    public selectedWord: number = -1;

    public crosswordGame: CrosswordGame = CROSSWORD_GAME;
    public getCurrentGame(): CrosswordGame {
        return this.crosswordGame;
    }
}

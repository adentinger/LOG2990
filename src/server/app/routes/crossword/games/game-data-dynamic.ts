import { GameData } from './game-data';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Difficulty } from '../../../../../common/src/crossword/crossword-enums';

export class GameDataDynamic extends GameData {

    constructor(difficulty: Difficulty) {
        super(difficulty);
    }

    public updateData(gridWords: GridWord[]): void {
        this.wordsInternal = gridWords;
        this.setDefinitions();
    }

}

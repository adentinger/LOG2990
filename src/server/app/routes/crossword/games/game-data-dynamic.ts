import { GameData } from './game-data';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { GridMutator } from '../grid-generator/grid-mutator';
import { toGridGeneratorDifficulty } from './temp-util';

export class GameDataDynamic extends GameData {

    private mutator: GridMutator;

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.mutator = new GridMutator(toGridGeneratorDifficulty(difficulty));
    }

    public updateData(gridWords: GridWord[]): void {
        this.wordsInternal = gridWords;
        this.setDefinitions();
    }

    public get mutatedWords(): Promise<GridWord[]> {
        return this.mutator.mutatedGrid.then(grid => grid.toGridWords());
    }

}

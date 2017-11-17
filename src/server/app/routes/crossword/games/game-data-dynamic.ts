import { GameData } from './game-data';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Difficulty, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GridMutator } from '../grid-generator/grid-mutator';
import { toGridGeneratorDifficulty } from './temp-util';
import { Word } from '../grid-generator/word';

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

    public validateWord(wordGuess: GridWord): boolean {
        const validated = super.validateWord(wordGuess);

        if (validated) {
            this.mutator.cancelMutation();
            this.mutator.mutateGrid(
                this.wordsInternal
                    .filter(gridWord => gridWord.owner !== Owner.none)
                    .map(gridWord => Word.fromGridWord(gridWord))
            );
        }

        return validated;
    }

}

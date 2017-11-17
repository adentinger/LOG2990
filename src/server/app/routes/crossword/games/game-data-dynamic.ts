import { GameData } from './game-data';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Difficulty, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GridMutator } from '../grid-generator/grid-mutator';
import { toGridGeneratorDifficulty } from './temp-util';
import { Word } from '../word';

export class GameDataDynamic extends GameData {

    private mutator: GridMutator;

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.mutator = new GridMutator(toGridGeneratorDifficulty(difficulty));
    }

    public applyMutation(): Promise<void> {
        return this.mutatedWords.then(words => {
            this.wordsInternal = words;
            this.setDefinitions();
        });
    }

    protected get mutatedWords(): Promise<GridWord[]> {
        return this.mutator.mutatedGrid.then(grid => grid.toGridWords());
    }

    public validateWord(wordGuess: GridWord): boolean {
        const validated = super.validateWord(wordGuess);

        if (validated) {
            this.mutator.cancelMutation().then(() => {
                this.mutator.mutateGrid(
                    this.wordsInternal
                        .filter(gridWord => gridWord.owner !== Owner.none)
                        .map(gridWord => Word.fromGridWord(gridWord))
                );
            });
        }

        return validated;
    }

}

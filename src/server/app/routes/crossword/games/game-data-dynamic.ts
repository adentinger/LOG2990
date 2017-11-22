import { GameData, DefinitionWithIndex } from './game-data';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { GridMutator } from '../grid-generator/grid-mutator';
import { toGridGeneratorDifficulty } from './temp-util';
import { Player } from '../player';
import { Grid } from '../grid-generator/grid';
import { Logger } from '../../../../../common/src/index';

interface MutationData {
    grid: Grid;
    definitions: DefinitionWithIndex[];
}

export class GameDataDynamic extends GameData {

    private mutator: GridMutator;
    private logger = Logger.getLogger('GameDataDynamic');

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.mutator = new GridMutator(toGridGeneratorDifficulty(difficulty));
        this.startMutatingGrid();
    }

    public applyMutation(): Promise<void> {
        return this.mutatedGrid.then(grid => {
            this.grid = grid;
            this.setDefinitions();
            this.startMutatingGrid();
        }).catch(() => this.logger.warn('Failed to apply mutation.'));
    }

    protected get mutatedGrid(): Promise<Grid> {
        return new Promise((resolve, reject) => {
            this.mutator.mutatedGrid.then(grid => {
                if (grid !== null) {
                    resolve(grid);
                }
                else {
                    reject('[GameDataDynamic]: Grid generation cancelled');
                }
            });
        });
    }

    public validateWord(wordGuess: GridWord, player: Player): boolean {
        const validated = super.validateWord(wordGuess, player);

        if (validated) {
            const mutationCancellation = this.mutator.cancelMutation()
                .catch(() => this.logger.warn('Failed to cancel mutation.'));
            if (this.wordsLeftToFind.length > 0) {
                mutationCancellation
                    .then(() => this.startMutatingGrid());
            }
        }

        return validated;
    }

    private startMutatingGrid(): void {
        this.mutator.mutateGrid(
            this.grid.words
                .filter(word => word.owner !== Player.NO_PLAYER)
        ).catch(() => { return; });
    }

}

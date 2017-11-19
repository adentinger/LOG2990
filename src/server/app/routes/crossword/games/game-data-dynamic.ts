import { GameData } from './game-data';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { GridMutator } from '../grid-generator/grid-mutator';
import { toGridGeneratorDifficulty } from './temp-util';
import { Player } from '../player';
import { Grid } from '../grid-generator/grid';

export class GameDataDynamic extends GameData {

    private mutator: GridMutator;

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
        });
    }

    protected get mutatedGrid(): Promise<Grid> {
        return this.mutator.mutatedGrid;
    }

    public validateWord(wordGuess: GridWord, player: Player): boolean {
        const validated = super.validateWord(wordGuess, player);

        if (validated) {
            this.mutator.cancelMutation().then(() => this.startMutatingGrid());
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

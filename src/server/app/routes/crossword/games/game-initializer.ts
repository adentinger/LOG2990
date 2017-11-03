import { Difficulty, Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { GridBanks } from '../grid-bank/grid-banks';
import { Grid } from '../grid-generator/grid';
import { Definition } from '../../../../../common/src/crossword/definition';

export interface DefinitionWithIndex {
    definition: Definition;
    index: number;
}

export class GameInitializer {

    private static readonly instance = new GameInitializer();

    public static getInstance(): GameInitializer {
        return GameInitializer.instance;
    }

    private constructor() {}

    public async initializeGrid(difficulty: Difficulty): Promise<GridWord[]> {
        const grid = await this.fetchGrid(difficulty);
        const gridWords = this.convertGridToGridWords(grid);
        return gridWords;
    }

    public async getDefinitionsOf(gridWords: GridWord[]): Promise<DefinitionWithIndex[]> {
        const DEFINITIONS: DefinitionWithIndex[] = [];

        let currentHorizontalId = 1;
        let currentVerticalId = 1;
        for (let i = 0; i < gridWords.length; ++i) {
            const WORD = gridWords[i];

            let index;
            if (WORD.direction === Direction.horizontal) {
                index = currentHorizontalId;
                ++currentHorizontalId;
            }
            else {
                index = currentVerticalId;
                ++currentVerticalId;
            }

            const DEFINITION_WITH_INDEX = {
                definition: new Definition(
                    'CHUCK NORRIS IS SO COOL',
                    WORD.direction
                ),
                index: index
            };
            DEFINITIONS.push(DEFINITION_WITH_INDEX);
        }

        return DEFINITIONS;
    }

    private async fetchGrid(difficulty: Difficulty): Promise<Grid> {
        switch (difficulty) {
            case Difficulty.easy: {
                return await GridBanks.getInstance().getEasyGrid();
            }
            case Difficulty.medium: {
                return await GridBanks.getInstance().getNormalGrid();
            }
            case Difficulty.hard: {
                return await GridBanks.getInstance().getHardGrid();
            }
            default: throw new Error(`Unknown difficulty: ${difficulty}`);
        }
    }

    private convertGridToGridWords(grid: Grid): GridWord[] {
        const HORIZONTAL_WORDS: GridWord[] =
            grid.across.map(
                (word, index) =>
                    new GridWord(
                        index + 1,
                        word.position.row,
                        word.position.column,
                        word.value.length,
                        Direction.horizontal,
                        Owner.none,
                        word.value
                    )
            );
        const VERTICAL_WORDS: GridWord[] =
            grid.vertical.map(
                (word, index) =>
                    new GridWord(
                        index + 1,
                        word.position.row,
                        word.position.column,
                        word.value.length,
                        Direction.vertical,
                        Owner.none,
                        word.value
                    )
            );

        return HORIZONTAL_WORDS.concat(VERTICAL_WORDS);
    }

}

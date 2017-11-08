import { Difficulty, Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { GridBanks } from '../grid-bank/grid-banks';
import { Grid } from '../grid-generator/grid';
import { Definition } from '../../../../../common/src/crossword/definition';
import { LexiconCaller } from '../lexic/lexicon-caller';

export interface DefinitionWithIndex {
    definition: Definition;
    index: number;
}

export class GameData {

    private wordsInternal: GridWord[] = [];
    private definitionsInternal: DefinitionWithIndex[] = [];

    public async initialize(difficulty: Difficulty): Promise<void> {
        await this.initializeWords(difficulty);
        await this.initializeDefinitions(difficulty);
    }

    public get words(): GridWord[] {
        return this.wordsInternal.slice();
    }

    public get emptyWords(): GridWord[] {
        return this.wordsInternal.map((word) => {
            return new GridWord(
                word.id,
                word.y,
                word.x,
                word.length,
                word.direction,
                Owner.none,
                ''
            );
        });
    }

    public get definitions(): DefinitionWithIndex[] {
        return this.definitionsInternal.slice();
    }

    private async initializeWords(difficulty: Difficulty): Promise<void> {
        const grid = await this.fetchGrid(difficulty);
        this.wordsInternal = this.convertGridToGridWords(grid);
    }

    private async initializeDefinitions(difficulty: Difficulty): Promise<void> {
        const DEFINITIONS: DefinitionWithIndex[] = [];

        let currentHorizontalId = 1;
        let currentVerticalId = 1;
        for (let i = 0; i < this.wordsInternal.length; ++i) {
            const word = this.wordsInternal[i];

            let index;
            if (word.direction === Direction.horizontal) {
                index = currentHorizontalId;
                ++currentHorizontalId;
            }
            else {
                index = currentVerticalId;
                ++currentVerticalId;
            }

            const DEFINITION_WITH_INDEX = {
                definition: await this.getDefinitionOfWord(word, difficulty),
                index: index
            };
            DEFINITIONS.push(DEFINITION_WITH_INDEX);
        }

        this.definitionsInternal = DEFINITIONS;
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

    private async getDefinitionOfWord(word: GridWord, difficulty: Difficulty): Promise<Definition> {
        const definitions = await LexiconCaller.getInstance().getDefinitions(word.string);

        let definitionString: string;
        switch (difficulty) {
            case Difficulty.easy: {
                definitionString = definitions[0];
                break;
            }
            case Difficulty.medium: // fallthrough
            case Difficulty.hard: {
                if (definitions.length > 1) {
                    definitions.shift();
                    const randomDefinition =
                        definitions[Math.floor(Math.random() * definitions.length)];
                    definitionString = randomDefinition;
                }
                else {
                    definitionString = definitions[0];
                }
                break;
            }
        }

        const definition = new Definition(
            definitionString,
            word.direction
        );

        return definition;
    }

}

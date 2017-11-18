import { Difficulty, Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { GridBanks } from '../grid-bank/grid-banks';
import { Grid } from '../grid-generator/grid';
import { Definition } from '../../../../../common/src/crossword/definition';
import { LexiconCaller } from '../lexic/lexicon-caller';
import { Player } from '../player';

export interface DefinitionWithIndex {
    definition: Definition;
    index: number;
}

export abstract class GameData {

    protected difficulty: Difficulty;
    protected wordsInternal: GridWord[] = [];

    private definitionsInternal: DefinitionWithIndex[] = [];

    public get words(): GridWord[] {
        return this.wordsInternal.slice();
    }

    public get wordsViewedByPlayer(): GridWord[] {
        return this.wordsInternal.map((word) => {
            const stringValue = (word.owner === Owner.none ? '' : word.string);
            return new GridWord(
                word.id,
                word.y,
                word.x,
                word.length,
                word.direction,
                Owner.none,
                stringValue
            );
        });
    }

    public get definitions(): DefinitionWithIndex[] {
        return this.definitionsInternal.slice();
    }

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    public async initialize(): Promise<void> {
        const grid = await this.fetchGrid();
        this.wordsInternal = grid.toGridWords(new Player('TODO', 'TODO'));
        await this.setDefinitions();
    }

    public validateWord(wordGuess: GridWord): boolean {
        const index = this.wordsInternal.findIndex(
            (word) => {
                return word.direction === wordGuess.direction &&
                       word.string === wordGuess.string &&
                       word.x === wordGuess.x &&
                       word.y === wordGuess.y;
            });
        const found = index >= 0;

        if (found) {
            // TODO mark the word as found by the player.
        }

        return found;
    }

    protected async setDefinitions(): Promise<void> {
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
                definition: await this.getDefinitionOfWord(word),
                index: index
            };
            DEFINITIONS.push(DEFINITION_WITH_INDEX);
        }

        this.definitionsInternal = DEFINITIONS;
    }

    private async fetchGrid(): Promise<Grid> {
        switch (this.difficulty) {
            case Difficulty.easy: {
                return await GridBanks.getInstance().getEasyGrid();
            }
            case Difficulty.normal: {
                return await GridBanks.getInstance().getNormalGrid();
            }
            case Difficulty.hard: {
                return await GridBanks.getInstance().getHardGrid();
            }
            default: throw new Error(`Unknown difficulty: ${this.difficulty}`);
        }
    }

    private async getDefinitionOfWord(word: GridWord): Promise<Definition> {
        const definitions = await LexiconCaller.getInstance().getDefinitions(word.string);

        let definitionString: string;
        switch (this.difficulty) {
            case Difficulty.easy: {
                definitionString = definitions[0];
                break;
            }
            case Difficulty.normal: // fallthrough
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

        const regex = new RegExp(`(^|\\W)${word.string}(s?(?:\\W|$))`, 'gmi');
        const replacement = '_'.repeat(word.string.length);
        definitionString = definitionString.replace(regex, `$1${replacement}$2`);

        const definition = new Definition(
            definitionString,
            word.direction
        );

        return definition;
    }

}

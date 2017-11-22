import { Difficulty, Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GridBanks } from '../grid-bank/grid-banks';
import { Grid } from '../grid-generator/grid';
import { Definition } from '../../../../../common/src/crossword/definition';
import { LexiconCaller } from '../lexic/lexicon-caller';
import { Player } from '../player';
import { Word } from '../word';
import { GridWord } from '../../../../../common/src/crossword/grid-word';

export interface DefinitionWithIndex {
    definition: Definition;
    index: number;
}

/**
 * @class GameData
 * @description Contains a grid and has the responsibility of managing it,
 * and updating it if requested.
 *
 * Internally, this class contains instances of the Word class, but for the outside
 * world, only GridWords exist. This means, however, that classes that use the GameData
 * class have to specify for which user they want to get GridWords, because a GridWord's
 * owner is either the 'player' or their 'opponent'.
 */
export abstract class GameData {

    protected difficulty: Difficulty;
    protected grid: Grid = new Grid();

    private definitionsInternal: DefinitionWithIndex[] = [];
    private initializedInternal: Promise<void>;

    public get initialized(): Promise<void> {
        return this.initializedInternal;
    }

    public get definitions(): DefinitionWithIndex[] {
        return this.definitionsInternal.slice();
    }

    public get wordsLeftToFind(): Word[] {
        return this.grid.words.filter(word => word.owner !== Player.NO_PLAYER);
    }

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
        this.initialize();
    }

    public getGridWords(player: Player, opponent: Player): GridWord[] {
        return this.grid.toGridWords(player);
    }

    public wordsViewedByPlayer(player: Player): GridWord[] {
        const gridWords = this.grid.toGridWords(player);
        gridWords.forEach(gridWord => {
            if (gridWord.owner === Owner.none) {
                gridWord.string = '';
            }
        });
        return gridWords;
    }

    public initialize(): void {
        this.initializedInternal = this.fetchGrid().then(grid => {
            this.grid = grid;
            return this.fetchDefinitions();
        }).then(definitions => {
            this.definitionsInternal = definitions;
        });
    }

    public validateWord(gridWordGuess: GridWord, player: Player): boolean {
        const wordGuess = Word.fromGridWord(gridWordGuess, player, Player.NO_PLAYER);
        const index = this.grid.words.findIndex(
            (existingWord) => {
                return existingWord.direction === wordGuess.direction &&
                       existingWord.value === wordGuess.value &&
                       existingWord.position.equals(wordGuess.position);
            });
        const found = index >= 0;

        if (found) {
            this.grid.words[index].owner = player;
        }

        return found;
    }

    protected async fetchDefinitions(): Promise<DefinitionWithIndex[]> {
        const definitions: DefinitionWithIndex[] = [];

        let currentHorizontalId = 1;
        let currentVerticalId = 1;
        for (let i = 0; i < this.grid.words.length; ++i) {
            const word = this.grid.words[i];

            let index;
            if (word.direction === Direction.horizontal) {
                index = currentHorizontalId;
                ++currentHorizontalId;
            }
            else {
                index = currentVerticalId;
                ++currentVerticalId;
            }

            const definitionWithIndex = {
                definition: await this.getDefinitionOfWord(word),
                index: index
            };
            definitions.push(definitionWithIndex);
        }

        return definitions;
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

    private async getDefinitionOfWord(word: Word): Promise<Definition> {
        const definitions = await LexiconCaller.getInstance().getDefinitions(word.value);

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

        const regex = new RegExp(`(^|\\W)${word.value}(s?(?:\\W|$))`, 'gmi');
        const replacement = '_'.repeat(word.value.length);
        definitionString = definitionString.replace(regex, `$1${replacement}$2`);

        const definition = new Definition(
            definitionString,
            word.direction
        );

        return definition;
    }

}

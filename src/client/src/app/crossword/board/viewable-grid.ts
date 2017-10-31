import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Grid } from './grid';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';

export class ViewableGrid {

    private dataWithoutUserInput: string[][];

    constructor(words: GridWord[] = []) {
        this.resetData();
        this.populateData(words);
        console.log(this.dataWithoutUserInput);
    }

    public getCharAt(row: number, column: number): string {
        return this.dataWithoutUserInput[row][column];
    }

    private resetData(): void {
        this.dataWithoutUserInput = [];
        for (let row = 0; row < Grid.DIMENSIONS; ++row) {
            this.dataWithoutUserInput.push([]);
            for (let column = 0; column < Grid.DIMENSIONS; ++column) {
                this.dataWithoutUserInput[row].push(Grid.BLACK_TILE);
            }
        }
    }

    private populateData(words: GridWord[]): void {
        words.forEach((word) => {
            this.fillWord(word, false);
        });
    }

    private fillWord(word: GridWord, shouldOverwrite: boolean): void {
        if (word.direction === Direction.horizontal) {
            this.fillHorizontalWord(word, shouldOverwrite);
        }
        else if (word.direction === Direction.vertical) {
            this.fillVerticalWord(word, shouldOverwrite);
        }
        else {
            throw new Error('Invalid direction: "' + word.direction + '"');
        }
    }

    private fillHorizontalWord(word: GridWord, shouldOverwrite: boolean): void {
        const ROW = word.y;
        for (let i = 0; i < word.length; ++i) {
            const COLUMN = word.x + i;
            const HAVE_EMPTY_CHAR =
                this.dataWithoutUserInput[ROW][COLUMN] === Grid.BLACK_TILE ||
                this.dataWithoutUserInput[ROW][COLUMN] === Grid.EMPTY_TILE;
            if (HAVE_EMPTY_CHAR || shouldOverwrite) {
                this.dataWithoutUserInput[ROW][COLUMN] =
                    this.wordCharAt(word, i);
            }
        }
    }

    private fillVerticalWord(word: GridWord, shouldOverwrite: boolean): void {
        const COLUMN = word.x;
        for (let i = 0; i < word.length; ++i) {
            const ROW = word.y + i;
            const HAVE_EMPTY_CHAR =
                this.dataWithoutUserInput[ROW][COLUMN] === Grid.BLACK_TILE ||
                this.dataWithoutUserInput[ROW][COLUMN] === Grid.EMPTY_TILE;
            if (HAVE_EMPTY_CHAR || shouldOverwrite) {
                this.dataWithoutUserInput[ROW][COLUMN] =
                    this.wordCharAt(word, i);
            }
        }
    }

    private wordCharAt(word: GridWord, index: number): string {
        const IS_WORD_FOUND = word.string.length > 0;
        if (IS_WORD_FOUND) {
            return word.string.charAt(index);
        }
        else {
            return Grid.EMPTY_TILE;
        }
    }

}

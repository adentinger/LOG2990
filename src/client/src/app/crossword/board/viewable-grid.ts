import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Grid } from './grid';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';

export class ViewableGrid {

    private dataWithoutUserInput: string[][];
    private data: string[][];

    constructor(words: GridWord[] = []) {
        this.resetData();
        this.populateData(words);
        this.userInput =
            new GridWord(0, 0, 0, 0, Direction.horizontal, Owner.none, '');
        console.log(this.data);
    }

    public getCharAt(row: number, column: number): string {
        return this.data[row][column];
    }

    public set userInput(input: GridWord) {
        this.cloneDataWithoutInput();
        this.fillWord(this.data, input, true);
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
            this.fillWord(this.dataWithoutUserInput, word, false);
        });
    }

    private fillWord(grid: string[][],
                     word: GridWord,
                     shouldOverwrite: boolean): void {
        if (word.direction === Direction.horizontal) {
            this.fillHorizontalWord(grid, word, shouldOverwrite);
        }
        else if (word.direction === Direction.vertical) {
            this.fillVerticalWord(grid, word, shouldOverwrite);
        }
        else {
            throw new Error('Invalid direction: "' + word.direction + '"');
        }
    }

    private fillHorizontalWord(grid: string[][],
                               word: GridWord,
                               shouldOverwrite: boolean): void {
        const ROW = word.y;
        for (let i = 0; i < word.length; ++i) {
            const COLUMN = word.x + i;
            const HAVE_EMPTY_CHAR =
                grid[ROW][COLUMN] === Grid.BLACK_TILE ||
                grid[ROW][COLUMN] === Grid.EMPTY_TILE;
            if (HAVE_EMPTY_CHAR || shouldOverwrite) {
                grid[ROW][COLUMN] = this.wordCharAt(word, i);
            }
        }
    }

    private fillVerticalWord(grid: string[][],
                             word: GridWord,
                             shouldOverwrite: boolean): void {
        const COLUMN = word.x;
        for (let i = 0; i < word.length; ++i) {
            const ROW = word.y + i;
            const HAVE_EMPTY_CHAR =
                grid[ROW][COLUMN] === Grid.BLACK_TILE ||
                grid[ROW][COLUMN] === Grid.EMPTY_TILE;
            if (HAVE_EMPTY_CHAR || shouldOverwrite) {
                grid[ROW][COLUMN] = this.wordCharAt(word, i);
            }
        }
    }

    private wordCharAt(word: GridWord, index: number): string {
        const IS_WORD_FOUND = word.string != null && word.string.length > 0;
        if (IS_WORD_FOUND) {
            return word.string.charAt(index);
        }
        else {
            return Grid.EMPTY_TILE;
        }
    }

    private cloneDataWithoutInput(): void {
        this.data = [];
        this.dataWithoutUserInput.forEach((data) => {
            this.data.push(data.slice());
        });
    }

}

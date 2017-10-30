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
        return null;
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
            if (word.direction === Direction.horizontal) {
                this.fillHorizontalWord(word);
            }
            else if (word.direction === Direction.vertical) {
                this.fillVerticalWord(word);
            }
            else {
                throw new Error('Invalid direction: "' + word.direction + '"');
            }
        });
    }

    private fillHorizontalWord(word: GridWord): void {

    }

    private fillVerticalWord(word: GridWord): void {

    }

}

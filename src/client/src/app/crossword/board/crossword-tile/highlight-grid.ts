import { GridWord } from '../../../../../../common/src/crossword/grid-word';
import { Grid } from '../../../../../../common/src/grid';
import { Direction } from '../../../../../../common/src/crossword/crossword-enums';

/**
 * Class which can tell whether a certain tile is selected.
 */
export class HighlightGrid {

    private data: boolean[][] = [];

    constructor(gridWord: GridWord) {
        const DATA = [];
        for (let row = 0; row < Grid.DIMENSIONS; ++row) {
            const ROW_DATA = [];
            for (let column = 0; column < Grid.DIMENSIONS; ++column) {
                ROW_DATA.push(this.shouldBeSelected(row, column, gridWord));
            }
            DATA.push(ROW_DATA);
        }
        this.data = DATA;
    }

    public isSelected(row: number, column: number): boolean {
        return this.data[row][column];
    }

    private shouldBeSelected(row: number, column: number, word: GridWord): boolean {
        if (word == null) {
            return false;
        }

        let shouldBeSelected: boolean;
        if (word.direction === Direction.horizontal) {
            shouldBeSelected =
                column === word.x &&
                row >= word.y &&
                row - word.y < word.length;
        }
        else {
            shouldBeSelected =
                row === word.y &&
                column >= word.x &&
                column - word.x < word.length;
        }
        return shouldBeSelected;
    }

}

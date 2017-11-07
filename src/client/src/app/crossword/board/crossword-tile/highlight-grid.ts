import { GridWord } from '../../../../../../common/src/crossword/grid-word';
import { Grid } from '../../../../../../common/src/grid';
import { Direction } from '../../../../../../common/src/crossword/crossword-enums';
import { SelectedGridWord } from '../selected-grid-word';

export enum WhoIsSelecting {
    noOne = 0,
    player,
    opponent,
    both,
    length
}

/**
 * Class which can tell whether a certain tile is selected.
 */
export class HighlightGrid {

    private data: WhoIsSelecting[][] = [];

    constructor(selection: SelectedGridWord = { playerSelection: null, opponentSelection: null }) {
        const DATA = [];
        for (let row = 0; row < Grid.DIMENSIONS; ++row) {
            const ROW_DATA = [];
            for (let column = 0; column < Grid.DIMENSIONS; ++column) {
                ROW_DATA.push(this.shouldBeSelected(row, column, selection));
            }
            DATA.push(ROW_DATA);
        }
        this.data = DATA;
    }

    public isSelected(row: number, column: number): WhoIsSelecting {
        return this.data[row][column];
    }

    private shouldBeSelected(row: number, column: number, word: SelectedGridWord): WhoIsSelecting {

        if (word.playerSelection === null && word.opponentSelection === null) {
            return WhoIsSelecting.noOne;
        }
        else if (word.playerSelection !== null && word.opponentSelection === null) {
            return this.isHighlighted(row, column, word.playerSelection, WhoIsSelecting.player);
        }
        else if (word.playerSelection === null && word.opponentSelection !== null) {
            return this.isHighlighted(row, column, word.opponentSelection, WhoIsSelecting.opponent);
        }
        else if (word.playerSelection !== null && word.playerSelection !== null && word.opponentSelection.id === word.playerSelection.id) {
            return this.isHighlighted(row, column, word.playerSelection, WhoIsSelecting.both);
        }

    }

    private isHighlighted(row: number, column: number, word: GridWord, type: WhoIsSelecting): WhoIsSelecting {
        let shouldBeSelected: WhoIsSelecting = WhoIsSelecting.noOne;

        if (word.direction === Direction.horizontal &&
            row === word.y &&
            column >= word.x &&
            column - word.x < word.length) {
            shouldBeSelected = type;
        }
        else if (word.direction === Direction.vertical &&
            column === word.x &&
            row >= word.y &&
            row - word.y < word.length) {
            shouldBeSelected = type;
        }
        return shouldBeSelected;
    }
}

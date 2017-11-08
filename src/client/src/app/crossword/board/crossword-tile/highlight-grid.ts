import { GridWord } from '../../../../../../common/src/crossword/grid-word';
import { Grid } from '../../../../../../common/src/grid';
import { Direction, Owner } from '../../../../../../common/src/crossword/crossword-enums';
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
    private wordsFound: WhoIsSelecting[][] = [];

    constructor(selection: SelectedGridWord = { playerSelection: null, opponentSelection: null }, words: GridWord[] = []) {
        const DATA = [];
        const found = [];
        for (let row = 0; row < Grid.DIMENSIONS; ++row) {
            const ROW_DATA = [];
            const rowFound = [];
            for (let column = 0; column < Grid.DIMENSIONS; ++column) {
                ROW_DATA.push(this.shouldBeSelected(row, column, selection));
                for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                    if (this.isFilled(row, column, words[wordIndex]) !== WhoIsSelecting.noOne) {
                        rowFound.push(this.isFilled(row, column, words[wordIndex]));
                    }
                }
            }
            DATA.push(ROW_DATA);
            found.push(rowFound);
        }
        this.data = DATA;
        this.wordsFound = found;
        console.log(this.wordsFound);
    }

    public isSelected(row: number, column: number): WhoIsSelecting {
        return this.data[row][column];
    }

    public hasBeenFound(row: number, column: number): WhoIsSelecting {
        return this.wordsFound[row][column];
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

    private isFilled(row: number, column: number, word: GridWord): WhoIsSelecting {
        let wordBelongsTo: WhoIsSelecting = WhoIsSelecting.noOne;

        if (word.owner === Owner.player1) {
            wordBelongsTo = this.isHighlighted(row, column, word, WhoIsSelecting.player);
        }
        else if (word.owner === Owner.player2) {
            wordBelongsTo = this.isHighlighted(row, column, word, WhoIsSelecting.opponent);
        }

        return wordBelongsTo;
    }

}

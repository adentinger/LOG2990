import { Injectable } from '@angular/core';
import { SelectedWord } from '../../../../common/src/crossword/selected-word';
import { CrosswordGridService } from '../crossword/board/crossword-grid.service';
import { Direction } from '../../../../common/src/crossword/crossword-enums';

@Injectable()
export class SelectionService {

    public isCurrentlySelected;
    public selection: SelectedWord;

    constructor(private crosswordGridService: CrosswordGridService) {
        this.selection = new SelectedWord();
        this.isCurrentlySelected = false;
    }

    /**
     * Returns the coordinate of the selected word in MATRIX NOTATION (y,x)
     * or NULL if none is selected
     */
    public getSelectedWordCoordinates(): [number, number] {
        if (!this.isCurrentlySelected) {
            return null;
        }
        let x, y;
        if (this.selection.direction === Direction.horizontal) {
            x = this.crosswordGridService.horizontalGridWords.get(this.selection.index).x;
            y = this.crosswordGridService.horizontalGridWords.get(this.selection.index).y;
        } else if (this.selection.direction === Direction.vertical) {
            x = this.crosswordGridService.verticalGridWords.get(this.selection.index).x;
            y = this.crosswordGridService.verticalGridWords.get(this.selection.index).y;
        }
        return [y, x];
    }

    public getSelectedWordLength(): number {
        if (!this.isCurrentlySelected) {
            return null;
        }
        if (this.selection.direction === Direction.horizontal) {
            return this.crosswordGridService.horizontalGridWords.get(this.selection.index).length;
        } else if (this.selection.direction === Direction.vertical) {
            return this.crosswordGridService.verticalGridWords.get(this.selection.index).length;
        }
    }

}

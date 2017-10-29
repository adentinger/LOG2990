import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SelectedWord } from '../../../../common/src/crossword/selected-word';
import { CrosswordGridService } from '../crossword/board/crossword-grid.service';
import { Direction } from '../../../../common/src/crossword/crossword-enums';

@Injectable()
export class SelectionService {

    private currentSelectionInternal: SelectedWord;

    constructor(private crosswordGridService: CrosswordGridService) {
        this.selection = new SelectedWord();
    }

    public get selection(): SelectedWord {
        return this.currentSelectionInternal;
    }

    public set selection(selection: SelectedWord) {
        this.currentSelectionInternal = selection;
    }

    public get isCurrentlySelected(): boolean {
        return this.selection.index >= 0;
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
        x = this.crosswordGridService.horizontalGridWords.get(this.selection.index).x;
        y = this.crosswordGridService.horizontalGridWords.get(this.selection.index).y;
        return [y, x];
    }

    public getSelectedWordLength(): number {
        if (!this.isCurrentlySelected) {
            return null;
        }
        return this.crosswordGridService.horizontalGridWords.get(this.selection.index).length;
    }

}

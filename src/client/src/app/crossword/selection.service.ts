import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { CrosswordGridService } from '../crossword/board/crossword-grid.service';
import { Direction } from '../../../../common/src/crossword/crossword-enums';
import { GridWord } from '../../../../common/src/crossword/grid-word';

@Injectable()
export class SelectionService {

    public static readonly NO_SELECTION: GridWord = null;

    private selectionValueInternal: GridWord;
    private selectionSubject = new Subject<GridWord>();

    constructor() {
        this.selectionValueInternal = null;
    }

    public get selection(): Subject<GridWord> {
        return this.selectionSubject;
    }

    public get isCurrentlySelected(): boolean {
        return this.selectionValueInternal !== null;
    }

    public get selectionValue(): GridWord {
        return this.selectionValueInternal;
    }

}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { GridWord } from '../../../../common/src/crossword/grid-word';
import { Definition } from './definition-field/definition';

@Injectable()
export class SelectionService {

    public static readonly NO_SELECTION: GridWord = null;

    private selectionValueInternal: GridWord;
    private selectionSubject = new Subject<GridWord>();

    constructor() {
        this.selectionValueInternal = null;
        this.selectionSubject.subscribe((word) => {
            this.selectionValueInternal = word;
        });
    }

    public get selection(): Subject<GridWord> {
        return this.selectionSubject;
    }

    public get hasSelectedWord(): boolean {
        return this.selectionValueInternal !== SelectionService.NO_SELECTION;
    }

    public get selectionValue(): GridWord {
        return this.selectionValueInternal;
    }

    public isDefinitionSelected(definition: Definition): boolean {
        return this.selectionValue != null &&
               definition.index === this.selectionValue.id &&
               definition.direction === this.selectionValue.direction;
    }

}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { GridWord } from '../../../../common/src/crossword/grid-word';
import { Definition } from './definition-field/definition';
import { SelectedGridWord } from './board/selected-grid-word';

@Injectable()
export class SelectionService {

    public static readonly NO_SELECTION = new SelectedGridWord();

    private selectionValueInternal = new SelectedGridWord();
    private selectionSubject = new Subject<SelectedGridWord>();

    constructor() {
        this.selectionSubject.subscribe((word) => {
            this.selectionValueInternal = word;
        });
    }

    public get selection(): Subject<SelectedGridWord> {
        return this.selectionSubject;
    }

    public get hasSelectedWord(): boolean {
        return this.selectionValueInternal !== SelectionService.NO_SELECTION;
    }

    public get selectionValue(): SelectedGridWord {
        return this.selectionValueInternal;
    }

    public isDefinitionSelected(definition: Definition): boolean {
        return this.selectionValue.playerSelection != null &&
               definition.index === this.selectionValue.playerSelection.id &&
               definition.direction === this.selectionValue.playerSelection.direction;
    }

    public updateSelectedGridWord(word: GridWord): void {
        this.selectionSubject.next(new SelectedGridWord(word, this.selectionValueInternal.opponentSelection));
    }
}

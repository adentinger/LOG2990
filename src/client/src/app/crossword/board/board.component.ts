import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CrosswordGridService } from './crossword-grid.service';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { SelectionService } from '../selection.service';

import '../../../../../common/src/crossword/packets/word-try.parser';
import { HighlightGrid, WhoIsSelecting } from './crossword-tile/highlight-grid';
import { Subscription } from 'rxjs/Subscription';
import { Grid } from '../../../../../common/src/grid';
import { Owner } from '../../../../../common/src/crossword/crossword-enums';
import { SelectedGridWord } from './selected-grid-word';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

    public readonly DIMENSIONS = Array(Grid.DIMENSIONS);

    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    private highlightGrid = new HighlightGrid();
    private selectionSubscription: Subscription;

    constructor(private crosswordGridService: CrosswordGridService,
                private selectionService: SelectionService,
                private ngZone: NgZone) {
        this.crosswordGridService.
            addOnChangeCallback(() => this.ngZone.run(() => {}));
    }

    public ngOnInit(): void {
        this.selectionSubscription =
            this.selectionService.selection.subscribe(
                (selected) => this.onSelect(selected)
            );
    }

    public ngOnDestroy(): void {
        this.selectionSubscription.unsubscribe();
    }

    public getGridCharAt(row: number, column: number) {
        return this.crosswordGridService.getCharAt(row, column);
    }

    private onSelect(selected: SelectedGridWord): void {
        this.highlightGrid = new HighlightGrid(selected);
        if (selected !== null) {
            this.inputBuffer.nativeElement.focus();
            this.inputBuffer.nativeElement.value = '';
        }
    }

    public onInputChange(inputValue: string) {
        const USER_WORD = this.makeWordFromInput(inputValue);
        this.inputBuffer.nativeElement.value = USER_WORD.string;
        this.crosswordGridService.setUserInput(USER_WORD);
    }

    public isHighlighted(row: number, column: number): WhoIsSelecting {
        return this.highlightGrid.isSelected(row, column);
    }

    private makeWordFromInput(input: string): GridWord {
        input = input.replace(/[^a-zA-Z]/g, '');
        input = input.toLowerCase();

        const SELECTED_WORD = this.selectionService.selectionValue.playerSelection;
        if (input.length > SELECTED_WORD.length) {
            input = input.substr(0, SELECTED_WORD.length);
        }
        return new GridWord(
            -1,
            SELECTED_WORD.y,
            SELECTED_WORD.x,
            SELECTED_WORD.length,
            SELECTED_WORD.direction,
            Owner.none,
            input
        );
    }

}

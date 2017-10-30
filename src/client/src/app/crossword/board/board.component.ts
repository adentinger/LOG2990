import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CrosswordGridService } from './crossword-grid.service';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { DefinitionsService } from '../definition-field/definitions.service';
import { SelectionService } from '../selection.service';

import '../../../../../common/src/crossword/packets/word-try.parser';
import { HighlightGrid } from './crossword-tile/highlight-grid';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    private highlightGrid = new HighlightGrid();
    private selectionSubscription: Subscription;

    constructor(private crosswordGridService: CrosswordGridService,
                private selectionService: SelectionService) {
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

    public get crosswordGrid() {
        return this.crosswordGridService['gridWithoutUserInput'];
    }

    private onSelect(selected: GridWord): void {
        this.highlightGrid = new HighlightGrid(selected);
        if (selected !== null) {
            this.inputBuffer.nativeElement.focus();
            this.inputBuffer.nativeElement.value = '';
        }
        this.crosswordGridService.clearGridOfUselessLetters();
    }

    public onInputChange(inputValue: string) {
        const INPUT = this.stripSymbols(inputValue);
        this.inputBuffer.nativeElement.value = INPUT;
        this.crosswordGridService.setUserInput(INPUT);
    }

    public isHighlighted(row: number, column: number): boolean {
        return this.highlightGrid.isSelected(row, column);
    }

    private stripSymbols(input: string): string {
        return input.replace(/[^a-zA-Z]/g, '');
    }

}

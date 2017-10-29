import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CrosswordGridService } from './crossword-grid.service';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { DefinitionsService } from '../definition-field/definitions.service';
import { SelectionService } from '../selection.service';

import '../../../../../common/src/crossword/packets/word-try.parser';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
    public indexOfDefinition: number;
    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    constructor(private crosswordGridService: CrosswordGridService,
        private selectionService: SelectionService,
        private definitionsService: DefinitionsService) { }

    public ngOnInit(): void {
        this.crosswordGrid = this.crosswordGridService.getViewableGrid();
    }

    public get crosswordGrid() {
        return this.crosswordGridService.crosswordGrid;
    }

    public set crosswordGrid(value: string[][]) {
        this.crosswordGridService.crosswordGrid = value;
    }

    public onSelect(indexDefinition: number): void {
        this.indexOfDefinition = indexDefinition;
        if (this.indexOfDefinition !== null) {
            this.inputBuffer.nativeElement.focus();
            this.inputBuffer.nativeElement.value = '';
        }
        this.crosswordGridService.clearGridOfUselessLetters();
    }

    public onChange(inputValue) {

        const input = this.crosswordGridService.stripSymbols(inputValue);
        this.inputBuffer.nativeElement.value = input;
        if (this.definitionsService.selectedDirection === Direction.horizontal) {
            const word = this.crosswordGridService.horizontalGridWords.get(this.indexOfDefinition);
            this.crosswordGridService.onInputChange(input, word);
        }
        else if (this.definitionsService.selectedDirection === Direction.vertical) {
            const word = this.crosswordGridService.verticalGridWords.get(this.indexOfDefinition);
            this.crosswordGridService.onInputChange(input, word);
        }
    }

    public checkIfHighlighted(line: number, column: number): boolean {
        if (this.selectionService.isCurrentlySelected === false) {
            return false;
        }

        const selectedDirection: Direction = this.selectionService.selection.direction;
        const selectedX: number = this.selectionService.getSelectedWordCoordinates()[1];
        const selectedY: number = this.selectionService.getSelectedWordCoordinates()[0];
        const selectedLenght: number = this.selectionService.getSelectedWordLength();

        let isCurrentlySelected;
        if (selectedDirection === Direction.horizontal) {
            isCurrentlySelected =
                line === selectedY &&
                column >= selectedX &&
                column <= selectedX + selectedLenght - 1;
        }
        else if (selectedDirection === Direction.vertical) {
            isCurrentlySelected =
                column === selectedX &&
                line >= selectedY &&
                line <= selectedY + selectedLenght - 1;
        }
        else {
            throw new Error('Unknown direction: "' + selectedDirection + '"');
        }
        return isCurrentlySelected;
    }
}

import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { CrosswordGridService } from './crossword-grid.service';
import { Direction, GridWord } from '../grid-word';
import { CrosswordGameService } from '../crossword-game.service';
import { DefinitionsService } from '../definition-field/definitions.service';
import { DefinitionFieldComponent } from '../definition-field/definition-field.component';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {
    public crosswordGrid: string[][];
    public wordBuffer = '';
    public disableInput = false;

    @Input('indexOfDefinition') public indexOfDefinition: number;
    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    public onSelect(): void {
        this.inputBuffer.nativeElement.focus();
        this.inputBuffer.nativeElement.value = '';
    }

    constructor(private crosswordGridService: CrosswordGridService,
        private crosswordGameService: CrosswordGameService, private definitionsService: DefinitionsService) { }

    public ngOnInit(): void {
        this.crosswordGrid = this.crosswordGridService.getViewableGrid();
    }

    private stripSymbols(input) {
        return input.replace(/[^a-zA-Z]/g, '');
    }

    private inputLettersOnGrid(word: GridWord, input: string) {
        for (let i = 0; i < word.length; i++) {
            if (word.direction === Direction.across) {
                if (i < input.length) {
                    this.crosswordGrid[word.y][word.x + i] = input[i];
                }
                else {
                    this.crosswordGrid[word.y][word.x + i] = '';
                }
            }
            else if (word.direction === Direction.vertical) {
                if (i < input.length) {
                    this.crosswordGrid[word.y + i][word.x] = input[i];
                }
                else {
                    this.crosswordGrid[word.y + i][word.x] = '';
                }
            }
        }
    }

    public clearGridBeforeEnteringAWordOnFocus() {
        const word = this.crosswordGridService.grid;
        for (let i = 0; i < word.length; i++) {
            if (this.inputBuffer.nativeElement.value === '' && word[i].string !== '') {
                this.inputLettersOnGrid(word[i], '');
            }
        }
    }

    // socketIO
    private sendWordToServer(input: string) {
        //
    }

    public onChange(inputValue) {
        const word = this.crosswordGridService.grid[this.indexOfDefinition];

        const input = this.stripSymbols(inputValue);

        this.inputBuffer.nativeElement.value = input;

        if (input.length < word.length) {
            this.inputLettersOnGrid(word, input);
        }
        else if (input.length === word.length) {
            this.inputLettersOnGrid(word, input);
            this.sendWordToServer(input);
            this.definitionsService.internalSelectedDefinitionId = -1;
            this.crosswordGameService.aDefinitionIsSelected = false;
        }
    }
}

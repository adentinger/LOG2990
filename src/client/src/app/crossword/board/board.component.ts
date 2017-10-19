import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CrosswordGridService } from './crossword-grid.service';
import { Direction, GridWord } from '../../common/crossword/grid-word';
import { CrosswordGameService } from '../crossword-game.service';
import { DefinitionsService } from '../definition-field/definitions.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {
    public crosswordGrid: string[][];
    public wordBuffer = '';
    public disableInput = false;

    public indexOfDefinition: number;
    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    public onSelect(indexDefinition: number): void {
        this.indexOfDefinition = indexDefinition;
        if (this.indexOfDefinition !== null) {
            this.inputBuffer.nativeElement.focus();
            this.inputBuffer.nativeElement.value = '';
        }

        this.clearGridOfUselessLetters();
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

    public clearGridOfUselessLetters(): void {
        const words = this.crosswordGridService.grid;
        for (let i = 0; i < words.length; i++) {
            if (words[i].string === '') {
                this.inputLettersOnGrid(words[i], '');
            }
        }
    }

    // TODO Verify the word entered if it matches the word on the server
    private sendWordToServer(input: string) {
        //
    }

    public onChange(inputValue) {
        const word = this.crosswordGridService.grid[this.indexOfDefinition];

        const input = this.stripSymbols(inputValue);

        this.inputBuffer.nativeElement.value = input;

        if (this.crosswordGameService.aDefinitionIsSelected) {
            if (input.length < word.length) {
                this.inputLettersOnGrid(word, input);
            }
            else if (input.length === word.length) {
                this.inputLettersOnGrid(word, input);
                this.sendWordToServer(input);

                this.handleResponseFromServer();

                this.definitionsService.internalSelectedDefinitionId = -1;
                this.crosswordGameService.aDefinitionIsSelected = false;
            }
        }
    }

    // TODO handle the response from server when the word is found or not
    private handleResponseFromServer() {
        const wordFound = false;
        if (wordFound) {
            //
        }
        if (!wordFound) {
            this.clearGridOfUselessLetters();
        }
    }
}

import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { CrosswordGridService } from './crossword-grid.service';
import { Direction } from '../grid-word';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    providers: [CrosswordGridService]
})

export class BoardComponent implements OnInit {
	public crosswordGrid: string[][];

    public wordBuffer: string = '';

    @Input('indexOfDefinition') indexOfDefinition: number;

    @ViewChild('inputBuffer') inputBuffer: ElementRef;
    public onSelect(): void {
        this.inputBuffer.nativeElement.focus();
        this.inputBuffer.nativeElement.value = '';
    }
    @ViewChild('crosswordBoard') private crosswordBoard: ElementRef;

    constructor(private crosswordGridService: CrosswordGridService) { }

    public ngOnInit(): void {
        this.crosswordGrid = this.crosswordGridService.getViewableGrid();
    }

    private stripSymbols(input) {
        return input.replace(/[^a-zA-Z]/g, '');
    }

    onChange(inputValue) {
        let word = this.crosswordGridService.grid[this.indexOfDefinition];

        let input = this.stripSymbols(inputValue);

        for (let i = 0; i < word.length; i++) {
            if (word.direction === Direction.across) {
                if ( i < input.length) {
                    this.crosswordGrid[word.y][word.x+i] = input[i];
                }
                else {
                    this.crosswordGrid[word.y][word.x+i] = '';
                }
            }
            else if (word.direction === Direction.vertical) {
                if ( i < input.length) {
                    this.crosswordGrid[word.y+i][word.x] = input[i];
                }
                else {
                    this.crosswordGrid[word.y+i][word.x] = '';
                }
            }
        }
    }
}

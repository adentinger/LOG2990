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

    @ViewChild('crosswordBoard') private crosswordBoard: ElementRef;

    constructor(private crosswordGridService: CrosswordGridService) { }

    public ngOnInit(): void {
        this.crosswordGrid = this.crosswordGridService.getGrid();
    }

    
    /*
    public focusOnInputFieldOnGrid() {
        let y = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].y;
        let x = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].x;
        let wordLength = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].length;
        let direction = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].direction;
        let aDefinitionIsSelected = this.crosswordGridService.crosswordGameService.aDefinitionIsSelected;
        
        if (aDefinitionIsSelected) {
            this.gridElement.nativeElement.querySelector('.square-' + y + '-' + x).focus();
        }
    }*/

    onChange(inputValue) {
        console.log(inputValue);
    }
}

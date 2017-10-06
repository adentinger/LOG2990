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
    @ViewChild('crosswordBoard') private gridElement: ElementRef;


    constructor(private crosswordGridService: CrosswordGridService) { }

    public ngOnInit(): void {
        this.crosswordGrid = this.crosswordGridService.getGrid();
    }

    public checkIfHighlighted(j: number, i: number): boolean {
        let y = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].y;
        let x = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].x;
        let wordLength = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].length;
        let direction = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].direction;
        let aDefinitionIsSelected = this.crosswordGridService.crosswordGameService.aDefinitionIsSelected;

        this.focusOnInputFieldOnGrid();


        if (aDefinitionIsSelected) {
            if (direction === Direction.across) {
                return (j === y && i >= x && i <= wordLength + x - 1);
            }
            else if (direction === Direction.vertical) {
                return (i === x && j >= y && j <= wordLength + y - 1);
            }
        }

        else {
            return false;
        }
    }

    public focusOnInputFieldOnGrid() {
        let y = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].y;
        let x = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].x;
        let wordLength = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].length;
        let direction = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].direction;
        let aDefinitionIsSelected = this.crosswordGridService.crosswordGameService.aDefinitionIsSelected;

        let a = y;
        let b = x;
        
        if (aDefinitionIsSelected) {
            this.gridElement.nativeElement.querySelector('.square-' + y + '-' + x).focus();
        }
    }
}

import { Component, OnInit } from '@angular/core';
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

    constructor(private crosswordGridService: CrosswordGridService) { }

    public ngOnInit(): void {
        this.crosswordGrid = this.crosswordGridService.getGrid();
        console.log(this.crosswordGrid);
    }
    public checkIfHighlighted(j: number, i: number): boolean {
        let y = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].y;
        let x = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].x;
        let wordLength = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].length;
        let direction = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].direction;
        let aDefinitionIsSelected = this.crosswordGridService.crosswordGameService.aDefinitionIsSelected;

        if (aDefinitionIsSelected) {
            if (direction === Direction.across) {
                if (j === y && i >= x && i <= wordLength+x-1) {
                    return true;
                }
            }
            else if (direction === Direction.vertical) {
                if (i === x && j >= y && j <= wordLength+y-1) {
                    return true;
                }
            }
        }

        else {
            return false;
        }
    }

    public checkIfDisabled(j: number, i: number): boolean {
        let y = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].y;
        let x = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].x;
        let wordLength = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].length;
        let direction = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].direction;
        let aDefinitionIsSelected = this.crosswordGridService.crosswordGameService.aDefinitionIsSelected;

        if (aDefinitionIsSelected) {
            if (direction === Direction.across) {
                if (j === y && i >= x && i <= x + wordLength) {
                    return false;
                }
    
            }
    
            else if (direction === Direction.vertical) {
                if (i === x && j >= y && j <= y + wordLength) {
                    return false;
                }
            }
        }

        else {
            return true;      
        }
    }
}

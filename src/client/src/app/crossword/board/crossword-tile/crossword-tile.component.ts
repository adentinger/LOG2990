import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CrosswordGridService } from '../crossword-grid.service';
import { Direction } from '../../grid-word';

@Component({
    selector: 'app-tile',
    templateUrl: './crossword-tile.component.html',
    styleUrls: ['./crossword-tile.component.scss'],
})
export class CrosswordTileComponent implements OnInit {

    @ViewChild('crosswordBoard') private gridElement: ElementRef;
    
    public ngOnInit() {}

    constructor(private crosswordGridService: CrosswordGridService) {}

    public checkIfHighlighted(j: number, i: number): boolean {
        let y = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].y,
            x = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].x;
        let wordLength = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].length;
        let direction = this.crosswordGridService.grid[this.crosswordGridService.crosswordGameService.selectedWordIndex].direction;
        let aDefinitionIsSelected = this.crosswordGridService.crosswordGameService.aDefinitionIsSelected;

        if (aDefinitionIsSelected) {
            //this.gridElement.nativeElement.querySelector('#inputText').focus();
            
            if (direction === Direction.across) {
                // updateLetter(i)
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

}

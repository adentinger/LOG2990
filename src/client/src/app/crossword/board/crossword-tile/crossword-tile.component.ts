import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { CrosswordGridService } from '../crossword-grid.service';
import { Direction } from '../../grid-word';

@Component({
    selector: 'app-tile',
    templateUrl: './crossword-tile.component.html',
    styleUrls: ['./crossword-tile.component.scss'],
})
export class CrosswordTileComponent implements OnInit {

	public tileValue: string;
	@Input() private tileRow: number;
	@Input() private tileColumn: number;

    @ViewChild('crosswordBoard') private gridElement: ElementRef;
	@Input() get tileChar() {
		return this.tileValue;
	}
	@Output() tileValueChange: EventEmitter<string> = new EventEmitter<string>();
	set tileChar(value) { 
		this.tileValue = value;
		this.tileValueChange.emit(this.tileValue);
	}
    
	public ngOnInit() {
		//this.tileChar = this.tileRow + '';
	}

	constructor(private crosswordGridService: CrosswordGridService) { }

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

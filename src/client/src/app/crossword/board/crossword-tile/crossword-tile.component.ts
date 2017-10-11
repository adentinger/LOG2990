import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { CrosswordGridService } from '../crossword-grid.service';
import { Direction } from '../../grid-word';
import { CrosswordGameService } from '../../crossword-game.service';

@Component({
    selector: 'app-tile',
    templateUrl: './crossword-tile.component.html',
    styleUrls: ['./crossword-tile.component.scss'],
})
export class CrosswordTileComponent implements OnInit {

    public tileValue: string;
    @Input() public readonly tileRow: number;
    @Input() public readonly tileColumn: number;

    @Input() get tileChar() {
        return this.tileValue;
    }
    @Output() public tileValueChange: EventEmitter<string> = new EventEmitter<string>();
    set tileChar(value) {
        this.tileValue = value;
        this.tileValueChange.emit(this.tileValue);
    }

    public ngOnInit() {
    }

    constructor(private crosswordGridService: CrosswordGridService, private crosswordGameService: CrosswordGameService) { }

    public checkIfHighlighted(): boolean {
        const   y = this.crosswordGridService.grid[this.crosswordGameService.selectedWordIndex].y,
                x = this.crosswordGridService.grid[this.crosswordGameService.selectedWordIndex].x,
                wordLength = this.crosswordGridService.grid[this.crosswordGameService.selectedWordIndex].length,
                direction = this.crosswordGridService.grid[this.crosswordGameService.selectedWordIndex].direction,
                aDefinitionIsSelected = this.crosswordGameService.aDefinitionIsSelected;

        if (aDefinitionIsSelected) {
            if (direction === Direction.across) {
                return (this.tileRow === y && this.tileColumn >= x && this.tileColumn <= wordLength + x - 1);
            }
            else if (direction === Direction.vertical) {
                return (this.tileColumn === x && this.tileRow >= y && this.tileRow <= wordLength + y - 1);
            }
        }
        else {
            return false;
        }
    }

    public checkIfGreyed(): boolean {
        const   y = this.crosswordGridService.grid[this.crosswordGameService.selectedWordIndex].y,
        x = this.crosswordGridService.grid[this.crosswordGameService.selectedWordIndex].x,
        wordLength = this.crosswordGridService.grid[this.crosswordGameService.selectedWordIndex].length,
        direction = this.crosswordGridService.grid[this.crosswordGameService.selectedWordIndex].direction,
        aDefinitionIsSelected = this.crosswordGameService.aDefinitionIsSelected;

        if (!aDefinitionIsSelected) {
            if (this.tileChar !== '') {
                return true;
            }
        }
        else {
            return false;
        }
    }
}

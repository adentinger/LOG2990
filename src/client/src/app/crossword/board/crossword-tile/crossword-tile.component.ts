import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { CrosswordGridService } from '../crossword-grid.service';
import { Direction } from '../../grid-word';
import { CrosswordGameService } from '../../crossword-game.service';

@Component({
    selector: 'app-tile',
    templateUrl: './crossword-tile.component.html',
    styleUrls: ['./crossword-tile.component.scss'],
})
export class CrosswordTileComponent implements OnInit {
    public wordsArray: string[] = [];
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

    @ViewChild('caseInput') public caseInput: ElementRef;

    public ngOnInit() {
    }


    constructor(private crosswordGridService: CrosswordGridService, private crosswordGameService: CrosswordGameService) { }

    public checkIfHighlighted(): boolean {
        const word = this.crosswordGridService.grid[this.crosswordGameService.selectedWordIndex];
        const aDefinitionIsSelected = this.crosswordGameService.aDefinitionIsSelected;

        if (aDefinitionIsSelected) {
            if (word.direction === Direction.across) {
                return (this.tileRow === word.y && this.tileColumn >= word.x && this.tileColumn <= word.length + word.x - 1);
            }
            else if (word.direction === Direction.vertical) {
                return (this.tileColumn === word.x && this.tileRow >= word.y && this.tileRow <= word.length + word.y - 1);
            }
        }
        else {
            return false;
        }
    }

    public checkIfGreyed(): boolean {
        const word = this.crosswordGridService.grid[this.crosswordGameService.lastSelectedWordIndex];
        const aDefinitionIsSelected = this.crosswordGameService.aDefinitionIsSelected;

        if (!aDefinitionIsSelected) {
            if (this.tileChar !== '' && word.string !== '') {
                return true;
            }
        }
        else {
            return false;
        }
    }

    public checkIfEmpty(): boolean {
        const word = this.crosswordGridService.grid[this.crosswordGameService.lastSelectedWordIndex];
        const aDefinitionIsSelected = this.crosswordGameService.aDefinitionIsSelected;

        if (!aDefinitionIsSelected) {
            if (word.direction === Direction.across) {
                if (this.tileRow === word.y && this.tileColumn >= word.x && this.tileColumn <= word.length + word.x - 1) {
                    if (this.tileChar !== '' && word.string === '') {
                        return true;
                    }
                }
            }
            else if (word.direction === Direction.vertical) {
                if (this.tileColumn === word.x && this.tileRow >= word.y && this.tileRow <= word.length + word.y - 1) {
                    if (this.tileChar !== '' && word.string === '') {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

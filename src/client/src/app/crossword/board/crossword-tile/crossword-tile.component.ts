import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { CrosswordGridService } from '../crossword-grid.service';
import { GridWord } from '../../../../../../common/src/crossword/grid-word';
import { Direction } from '../../../../../../common/src/crossword/crossword-enums';
import { CrosswordGameService } from '../../crossword-game.service';
import { DefinitionsService } from '../../definition-field/definitions.service';

@Component({
    selector: 'app-tile',
    templateUrl: './crossword-tile.component.html',
    styleUrls: ['./crossword-tile.component.scss'],
})
export class CrosswordTileComponent implements OnInit {

    public tileValue: string;
    @Input() public readonly tileRow: number;
    @Input() public readonly tileColumn: number;

    // @ViewChild('crosswordBoard') private gridElement: ElementRef;
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

    constructor(private crosswordGridService: CrosswordGridService,
        private crosswordGameService: CrosswordGameService,
        private definitionService: DefinitionsService) { }

    /*
    public checkIfTileIsInWordTiles(word: GridWord): boolean {
        if (word.direction === Direction.horizontal) {
            return (this.tileRow === word.y && this.tileColumn >= word.x && this.tileColumn <= word.length + word.x - 1);
        }
        else if (word.direction === Direction.vertical) {
            return (this.tileColumn === word.x && this.tileRow >= word.y && this.tileRow <= word.length + word.y - 1);
        }
        else {
            return false;
        }
    }
    */

    private checkIfInHorizontalTile(word: GridWord): boolean {
        return (this.tileRow === word.y && this.tileColumn >= word.x && this.tileColumn <= word.length + word.x - 1);
    }

    private checkIfInVerticalTile(word: GridWord): boolean {
        return (this.tileColumn === word.x && this.tileRow >= word.y && this.tileRow <= word.length + word.y - 1);
    }

    public checkIfHighlighted(): boolean {

        const aDefinitionIsSelected = this.crosswordGameService.aDefinitionIsSelected;

        if (this.definitionService.selectedDirection === Direction.horizontal && aDefinitionIsSelected) {
            const word = this.crosswordGridService.horizontalGridWords.get(this.crosswordGameService.selectedWordIndex);
            return this.checkIfInHorizontalTile(word);
        }
        else if (this.definitionService.selectedDirection === Direction.vertical && aDefinitionIsSelected) {
            const word = this.crosswordGridService.verticalGridWords.get(this.crosswordGameService.selectedWordIndex);
            return this.checkIfInVerticalTile(word);
        }
        else {
            return false;
        }

        /*
        if (aDefinitionIsSelected) {
            return this.checkIfTileIsInWordTiles(word);
        }
        else {
            return false;
        }
        */
    }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { BoardComponent } from './board/board.component';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    providers: [SimpleTimer]
})
export class CrosswordComponent implements OnInit {

    @ViewChild(BoardComponent) public gameBoard: BoardComponent;

    public gameIsBeingConfigured = true;
    public selectedDefinition: number;

    public selectedTiles: number[][] = []; // holds the coordinates of the tiles owned by
    // the current selected word, the individual tiles will look at this value to decide
    // if they should be hightlighted

    constructor() { }

    public ngOnInit(): void {
    }

    public onSelectedDefinitionChange(event) {
        this.selectedDefinition = event;
        this.gameBoard.onSelect();
    }
}

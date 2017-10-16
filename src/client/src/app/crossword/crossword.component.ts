import { Component, OnInit, ViewChild } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { BoardComponent } from './board/board.component';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    providers: [SimpleTimer,
        DefinitionsService]
})
export class CrosswordComponent implements OnInit {

    public gameIsBeingConfigured = true;
    public selectedDefinition: number;
    @ViewChild(BoardComponent) public gameBoard: BoardComponent;

    // holds the coordinates of the tiles owned by the current selected word, the individual
    // tiles will look at this value to decide if they should be hightlighted
    public selectedTiles: number[][] = [];

    public ngOnInit(): void {
    }

    public onSelectedDefinitionChange(event) {
        this.selectedDefinition = event;
        this.gameBoard.onSelect();
    }

}

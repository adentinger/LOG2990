import { Component, OnInit, ViewChild } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { BoardComponent } from './board/board.component';
import { CrosswordGameService } from './crossword-game.service';

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

    constructor(private crosswordGameService: CrosswordGameService) { }

    public ngOnInit(): void {
    }

    public onSelectedDefinitionChange(event) {
        this.selectedDefinition = event;
        this.gameBoard.onSelect(event);
    }

    public getShowWordsState(): boolean {
        return this.crosswordGameService.getShowWordsState();
    }

    public getShowWordsStateText(): string {
        return this.crosswordGameService.getShowWordsStateText();
    }

    public setShowWordsOnOff(): void {
        this.crosswordGameService.setShowWordsOnOff();
    }

    public getTimerState(): boolean {
        return this.crosswordGameService.getTimerState();
    }

    public getTimerStateText(): string {
        return this.crosswordGameService.getTimerStateText();
    }

    public setTimerOnOff(): void {
        return this.crosswordGameService.setTimerOnOff();
    }

    public changeTimerValue(seconds: string): void {
        this.crosswordGameService.changeTimerValue(seconds);
    }
}

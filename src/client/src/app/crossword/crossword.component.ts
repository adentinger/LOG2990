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
    @ViewChild(BoardComponent) public gameBoard: BoardComponent;

    constructor(private crosswordGameService: CrosswordGameService) { }

    public ngOnInit(): void {
    }

    public onCheatModeToggle(): void {
        this.crosswordGameService.setCheatModeOnOff();
    }

    public isCheatModeOn(): boolean {
        return this.crosswordGameService.getCheatModeState();
    }

    public getCheatModeStateText(): string {
        if (this.isCheatModeOn()) {
            return 'Disable';
        }
        else {
            return 'Enable';
        }
    }

    public onShowWordsToggle(): void {
        this.crosswordGameService.setShowWordsOnOff();
    }

    public isShowWordsOn(): boolean {
        return this.crosswordGameService.getShowWordsState();
    }

    public getShowWordsStateText(): string {
        if (this.isShowWordsOn()) {
            return 'Hide words';
        }
        else {
            return 'Show words';
        }
    }

    public onTimerRunningToggle(): void {
        this.crosswordGameService.setTimerOnOff();
    }

    public isTimerBeingSet(): boolean {
        return this.crosswordGameService.getTimerState();
    }

    public getTimerStateText(): string {
        if (this.isTimerBeingSet()) {
            return 'Disable';
        }
        else {
            return 'Set time';
        }
    }

    public changeTimerValue(seconds: string): void {
        this.crosswordGameService.changeTimerValue(seconds);
    }
}

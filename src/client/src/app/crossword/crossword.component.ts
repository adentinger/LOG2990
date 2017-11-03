import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { BoardComponent } from './board/board.component';
import { CrosswordGameService } from './crossword-game.service';
import { TimerService } from './services/timer.service';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    providers: [
        SimpleTimer,
        DefinitionsService,
        TimerService
    ]
})
export class CrosswordComponent implements OnInit {

    public gameIsBeingConfigured = true;

    constructor(private crosswordGameService: CrosswordGameService) { }

    public ngOnInit(): void {
    }

    public isShowWordsOn(): boolean {
        return this.crosswordGameService.getShowWordsState();
    }

}

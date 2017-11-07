import { Component, OnInit } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { GameService } from './game.service';
import { TimerService } from './services/timer.service';
import { GameHttpService } from './services/game-http.service';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    providers: [
        SimpleTimer,
        DefinitionsService,
        TimerService,
        GameHttpService,
        GameService
    ]
})
export class CrosswordComponent implements OnInit {

    public gameIsBeingConfigured = true;

    constructor(private crosswordGameService: GameService) { }

    public ngOnInit(): void {
    }

    public isShowWordsOn(): boolean {
        return this.crosswordGameService.getShowWordsState();
    }

}

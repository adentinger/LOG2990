import { Component, OnDestroy } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { TimerService } from './services/timer.service';
import { GameHttpService } from './services/game-http.service';
import { GameService } from './game.service';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    providers: [
        TimerService,
        GameHttpService
    ]
})
export class CrosswordComponent implements OnDestroy {

    public gameIsBeingConfigured = true;

    constructor(
        private definitions: DefinitionsService,
        private game: GameService) { }

    public ngOnDestroy(): void {

    }

}

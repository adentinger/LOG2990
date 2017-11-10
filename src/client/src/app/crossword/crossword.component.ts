import { Component, OnDestroy } from '@angular/core';
import { DefinitionsService } from './definition-field/definitions.service';
import { TimerService } from './services/timer.service';
import { GameHttpService } from './services/game-http.service';
import { GameService } from './game.service';
import { GridService } from './board/grid.service';

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
        private game: GameService,
        private grid: GridService) { }

    public ngOnDestroy(): void {
        this.definitions.clearDefinitions();
        this.game.finalize();
        this.grid.reinitialize();
    }

}

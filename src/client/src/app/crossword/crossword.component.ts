import { Component, OnInit } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { CrosswordGameService } from './crossword-game.service';
import { TimerService } from './services/timer.service';
import { GameService } from './services/game.service';
import { GameId, PlayerNumber } from '../../../../common/src/communication/game-configs';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    providers: [
        SimpleTimer,
        DefinitionsService,
        TimerService,
        GameService
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

    public joinGame(gameId: GameId): Promise<PlayerNumber> {
        return new Promise((resolve, reject) => resolve(1));
    }

}

import { Component, OnInit, NgZone } from '@angular/core';
import { CrosswordGameService } from '../crossword-game.service';
import { CrosswordGame } from '../class/crossword-game';
import { GameDetailsService } from './game-details.service';
import { GameMode } from '../../../../../common/src/crossword/crossword-enums';

@Component({
    selector: 'app-game-details',
    templateUrl: './game-details.component.html',
    styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
    public crosswordGame: CrosswordGame;
    public player1: string;
    public difficulty: string;
    public gameMode: GameMode;

    constructor(private crosswordGameService: CrosswordGameService, private gameDetailsService: GameDetailsService,
        private ngZone: NgZone) { }

    public ngOnInit(): void {
        this.crosswordGame = this.crosswordGameService.getCurrentGame();
        this.player1 = this.crosswordGameService.getCurrentGame().player1;
        this.difficulty = this.crosswordGameService.getCurrentGame().difficulty;
        this.gameMode = this.crosswordGameService.getCurrentGame().gameMode;

        setInterval(() => {
            this.ngZone.run(() => { });
        }, 1000);
    }

    public get timerValue() {
        return this.gameDetailsService.countdown * 1000;
    }
}

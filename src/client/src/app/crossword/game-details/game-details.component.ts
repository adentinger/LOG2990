import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { CrosswordGame } from '../class/crossword-game';
import { GameMode } from '../../../../../common/src/crossword/crossword-enums';
import { TimerService } from '../services/timer.service';

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

    constructor(private crosswordGameService: GameService,
                private timerService: TimerService) { }

    public ngOnInit(): void {
        this.crosswordGame = this.crosswordGameService.getCurrentGame();
        this.player1 = this.crosswordGameService.getCurrentGame().player1;
        this.difficulty = this.crosswordGameService.getCurrentGame().difficulty;
        this.gameMode = this.crosswordGameService.getCurrentGame().gameMode;
    }

    public get timerValue() {
        return this.timerService.timerValue * 1000;
    }

}

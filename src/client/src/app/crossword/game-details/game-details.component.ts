import { Component, OnInit } from '@angular/core';
import { CrosswordGameService } from "../crossword-game.service";
import { CrosswordGame } from "../class/crossword-game";
import { SimpleTimer } from 'ng2-simple-timer';

@Component({
    selector: 'app-game-details',
    templateUrl: './game-details.component.html',
    styleUrls: ['./game-details.component.css'],
    providers: [CrosswordGameService]
})
export class GameDetailsComponent implements OnInit {
    crosswordGame: CrosswordGame;
    player1: string;
    difficulty: string;
    gameMode: string;

    gameTimeMinutes = 0;
    gameTimeSeconds = 0;
    timerId: string;
    
    constructor(private crosswordGameService: CrosswordGameService,
                private simpleTimerService: SimpleTimer) { }
    
    public ngOnInit(): void {
        this.crosswordGame = this.crosswordGameService.getCurrentGame();
        this.player1 = this.crosswordGameService.getCurrentGame().player1;
        this.difficulty = this.crosswordGameService.getCurrentGame().difficulty;
        this.gameMode = this.crosswordGameService.getCurrentGame().gameMode;
        this.simpleTimerService.newTimer('GameTime', 1);
        // this.simpleTimerService.subscribe(GameTime, e => this.timerCallback());

        this.timerId = this.simpleTimerService.subscribe('GameTime', () => this.timerCallback());
    }
    
    timerCallback(): void {
        if (this.gameTimeSeconds !== 60 ) {
            this.gameTimeSeconds++;
        } else {
            this.gameTimeSeconds = 0;
            this.gameTimeMinutes++;
        }
    }
}

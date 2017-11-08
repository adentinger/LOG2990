import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { CrosswordGame } from '../class/crossword-game';
import { GameMode } from '../../../../../common/src/crossword/crossword-enums';
import { TimerService } from '../services/timer.service';
import { GridService } from '../board/grid.service';

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

    constructor(private gameService: GameService,
                private timerService: TimerService,
                private gridService: GridService) { }

    public ngOnInit(): void {
        this.crosswordGame = this.gameService.getCurrentGame();
        this.player1 = this.gameService.getCurrentGame().player1;
        this.difficulty = this.gameService.getCurrentGame().difficulty;
        this.gameMode = this.gameService.getCurrentGame().gameMode;
    }

    public get timerValue() {
        return this.timerService.timerValue * 1000;
    }

    public get playerWordsFound() {
        return this.gridService.getPlayerWordsFoundCount();
    }

    public get opponentWordsFound() {
        return this.gridService.getOpponentWordsFoundCount();
    }

}

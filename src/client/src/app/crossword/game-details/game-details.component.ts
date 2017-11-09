import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { TimerService } from '../services/timer.service';
import { GridService } from '../board/grid.service';

@Component({
    selector: 'app-game-details',
    templateUrl: './game-details.component.html',
    styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {

    constructor(public gameService: GameService,
                private timerService: TimerService,
                private gridService: GridService) { }

    public ngOnInit(): void {
    }

    public get modeName(): string {
        return 'Classic';
    }

    public get difficultyName(): string {
        return 'Hard';
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

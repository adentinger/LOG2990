import { Component, OnInit } from '@angular/core';
import { CrosswordGameService } from "../crossword-game.service";
import { CrosswordGame } from "../class/crossword-game";

@Component({
    selector: 'app-game-details',
    templateUrl: './game-details.component.html',
    styleUrls: ['./game-details.component.css'],
    providers: [CrosswordGameService]
})
export class GameDetailsComponent implements OnInit {

    crosswordGame: CrosswordGame;

    constructor(private crosswordGameService: CrosswordGameService) { }

    public ngOnInit(): void {
        this.crosswordGame = CrosswordGameService.getCurrentGame();
    }

}

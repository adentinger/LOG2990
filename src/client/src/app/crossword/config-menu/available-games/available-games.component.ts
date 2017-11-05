import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game.service';
import { UserDisplayableGameData } from './user-displayable-game-data';

@Component({
    selector: 'app-available-games',
    templateUrl: './available-games.component.html',
    styleUrls: ['./available-games.component.css']
})
export class AvailableGamesComponent implements OnInit {

    private gamesInternal: UserDisplayableGameData[] = [];

    constructor(public gameService: GameService) {
        this.refresh();
    }

    public ngOnInit() {
    }

    public get games(): UserDisplayableGameData[] {
        return this.gamesInternal;
    }

    public async refresh(): Promise<void> {
        this.gamesInternal = await this.gameService.getGames();
    }

}

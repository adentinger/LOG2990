import { Component } from '@angular/core';

import { GameService } from '../../services/game.service';
import { UserDisplayableGameData } from './user-displayable-game-data';
import { GameId } from '../../../../../../common/src/communication/game-configs';

@Component({
    selector: 'app-available-games',
    templateUrl: './available-games.component.html',
    styleUrls: ['./available-games.component.css']
})
export class AvailableGamesComponent {

    private gamesInternal: UserDisplayableGameData[] = [];
    public chosenGame: GameId = null;

    constructor(public gameService: GameService) {
        this.refresh();
    }

    public get games(): UserDisplayableGameData[] {
        return this.gamesInternal;
    }

    public async refresh(): Promise<void> {
        this.chosenGame = null;
        this.gamesInternal = []; // Display nothing while we refresh
        this.gamesInternal = await this.gameService.getGames();
    }

}

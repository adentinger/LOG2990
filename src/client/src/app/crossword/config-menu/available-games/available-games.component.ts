import { Component } from '@angular/core';

import { GameHttpService } from '../../services/game-http.service';
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

    constructor(public gameService: GameHttpService) {
        this.refresh();
    }

    public get games(): UserDisplayableGameData[] {
        return this.gamesInternal;
    }

    public choose(index: number): void {
        if (index >= 0 && index < this.gamesInternal.length) {
            this.chosenGame = this.gamesInternal[index].id;
        }
        else {
            throw new Error(`Choice index ${index} invalid`);
        }
    }

    public async refresh(): Promise<void> {
        this.chosenGame = null;
        this.gamesInternal = []; // Display nothing while we refresh
        this.gamesInternal = await this.gameService.getGames();
    }

}

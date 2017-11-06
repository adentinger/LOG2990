import { Component, Input } from '@angular/core';

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
    @Input() public shouldDisplay = true;
    public chosenGame: GameId = null;

    constructor(public gameHttpService: GameHttpService) {
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

    public isSelected(index: number): boolean {
        return this.gamesInternal[index].id === this.chosenGame;
    }

    public async refresh(): Promise<void> {
        this.chosenGame = null;
        this.gamesInternal = []; // Display nothing while we refresh
        this.gamesInternal = await this.gameHttpService.getGames();
    }

}

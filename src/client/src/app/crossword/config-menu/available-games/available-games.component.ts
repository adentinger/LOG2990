import { Component, Input, OnDestroy } from '@angular/core';

import { GameHttpService } from '../../services/game-http.service';
import { UserDisplayableGameData } from './user-displayable-game-data';
import { GameId } from '../../../../../../common/src/communication/game-configs';
import { Subscription } from 'rxjs/Subscription';
import { MenuAutomatonService } from '../menu-automaton.service';

@Component({
    selector: 'app-available-games',
    templateUrl: './available-games.component.html',
    styleUrls: ['./available-games.component.css']
})
export class AvailableGamesComponent implements OnDestroy {

    private gamesInternal: UserDisplayableGameData[] = [];
    private subscriptions: Subscription[] = [];

    @Input() public shouldDisplay = true;
    public chosenGame: GameId = null;

    constructor(public gameHttpService: GameHttpService,
                private menuAutomaton: MenuAutomatonService) {
        // Refresh the list whenever we move to the 'chooseGame' screen.
        const chooseGameState = this.menuAutomaton.states.chooseGame;
        const chooseGameArriveSubscription =
            chooseGameState.arrive.subscribe(() => {
                this.refresh();
            });
        this.subscriptions.push(chooseGameArriveSubscription);

        // We can leave the screen only if we picked a game.
        chooseGameState.canMoveToNextState = () => this.chosenGame !== null;
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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

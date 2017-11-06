import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MenuAutomatonService } from './menu-automaton.service';
import { AvailableGamesComponent } from './available-games/available-games.component';
import { GameHttpService } from '../services/game-http.service';
import { GameId } from '../../../../../common/src/communication/game-configs';
import { CreateOrJoin } from './menu-automaton-choices';
import { GameService } from '../game.service';

@Component({
    selector: 'app-config-menu',
    templateUrl: './config-menu.component.html',
    styleUrls: ['./config-menu.component.css'],
    providers: [
        MenuAutomatonService
    ]
})
export class ConfigMenuComponent implements OnInit, OnDestroy {

    public isConfiguringGame = true;
    public shouldShowAvailableGames = false;

    private hasGameStarted = false;
    private subscriptions: Subscription[] = [];
    @ViewChild(AvailableGamesComponent)
    private availableGamesComponent: AvailableGamesComponent;

    constructor(public menuAutomaton: MenuAutomatonService,
                private gameService: GameService,
                private gameHttpService: GameHttpService) { }

    public ngOnInit(): void {
        const chooseGameArriveSubscription = this.menuAutomaton.chooseGameArrive.subscribe(
            () => {
                this.shouldShowAvailableGames = true;
                this.availableGamesComponent.refresh();
            }
        );
        const chooseGameLeaveSubscription = this.menuAutomaton.chooseGameLeave.subscribe(
            () => this.shouldShowAvailableGames = false
        );
        const configEndSubscription = this.menuAutomaton.configEnd.subscribe(
            () => this.useConfiguration()
        );
        this.subscriptions.push(chooseGameArriveSubscription, chooseGameLeaveSubscription, configEndSubscription);
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    public get shouldBeDisplayed(): boolean {
        return this.isConfiguringGame || this.shouldShowWaitingComponent;
    }

    public get shouldShowWaitingComponent(): boolean {
        return !this.isConfiguringGame && !this.hasGameStarted;
    }

    private useConfiguration(): void {
        this.isConfiguringGame = false;
        const userChoices = this.menuAutomaton.choices;
        const isJoiningGame = userChoices.createOrJoin === CreateOrJoin.join;
        if (isJoiningGame) {
            this.gameService.joinGame(userChoices.chosenGame);
        }
        else {
            this.gameHttpService.requestGame(userChoices.toGameConfiguration())
                .then((gameId) => {
                    this.gameService.joinGame(gameId);
                });
        }
    }

}

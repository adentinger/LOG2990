import { Component, OnDestroy, ViewChild, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MenuAutomatonService } from './menu-automaton.service';
import { AvailableGamesComponent } from './available-games/available-games.component';
import { GameHttpService } from '../services/game-http.service';
import { GameId } from '../../../../../common/src/communication/game-configs';
import { CreateOrJoin } from './menu-automaton-choices';
import { GameService } from '../game.service';
import { WaitingService } from './waiting/waiting.service';

@Component({
    selector: 'app-config-menu',
    templateUrl: './config-menu.component.html',
    styleUrls: ['./config-menu.component.css'],
    providers: [
        MenuAutomatonService,
        WaitingService
    ]
})
export class ConfigMenuComponent implements AfterViewInit, OnDestroy {

    public isConfiguringGame = true;
    public shouldShowAvailableGames = false;

    private subscriptions: Subscription[] = [];

    constructor(public menuAutomaton: MenuAutomatonService,
                private waitingService: WaitingService,
                private gameService: GameService,
                private gameHttpService: GameHttpService) { }

    public ngAfterViewInit(): void {
        const chooseGameArriveSubscription = this.menuAutomaton.chooseGameArrive.subscribe(
            () => {
                this.shouldShowAvailableGames = true;
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
        return !this.isConfiguringGame && this.waitingService.isWaitingValue;
    }

    // "Shoo! Go away! I don't want to see this component anymore!" =>
    public shoo(): void {
        this.isConfiguringGame = false;
        this.waitingService.isWaiting.next(false);
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

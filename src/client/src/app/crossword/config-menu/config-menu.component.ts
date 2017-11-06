import { Component, OnDestroy, ViewChild, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MenuAutomatonService } from './menu-automaton.service';
import { AvailableGamesComponent } from './available-games/available-games.component';
import { GameHttpService } from '../services/game-http.service';
import { GameId } from '../../../../../common/src/communication/game-configs';
import { UserChoiceService, CreateOrJoin } from './user-choice.service';
import { GameService } from '../game.service';
import { WaitingService } from './waiting/waiting.service';

@Component({
    selector: 'app-config-menu',
    templateUrl: './config-menu.component.html',
    styleUrls: ['./config-menu.component.css'],
    providers: [
        MenuAutomatonService,
        WaitingService,
        UserChoiceService
    ]
})
export class ConfigMenuComponent implements AfterViewInit, OnDestroy {

    public isConfiguringGame = true;
    public shouldShowAvailableGames = false;

    private subscriptions: Subscription[] = [];
    @ViewChild(AvailableGamesComponent)
    private availableGamesComponent: AvailableGamesComponent;

    constructor(public menuAutomaton: MenuAutomatonService,
                private waitingService: WaitingService,
                private gameService: GameService,
                private gameHttpService: GameHttpService,
                private userChoiceService: UserChoiceService) { }

    public ngAfterViewInit(): void {
        const chooseGameArriveSubscription = this.menuAutomaton.states.chooseGame.arrive.subscribe(
            () => {
                this.shouldShowAvailableGames = true;
                this.availableGamesComponent.refresh();
            }
        );
        const chooseGameLeaveSubscription = this.menuAutomaton.states.chooseGame.leave.subscribe(
            () => {
                this.shouldShowAvailableGames = false;
            }
        );
        const configEndSubscription = this.menuAutomaton.configEnd.subscribe(
            () => {
                this.useConfiguration();
            }
        );
        this.subscriptions.push(chooseGameArriveSubscription, chooseGameLeaveSubscription, configEndSubscription);
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    public get shouldBeDisplayed(): boolean {
        return this.isConfiguringGame || this.waitingService.isWaitingValue;
    }

    // "Shoo! Go away! I don't want to see this component anymore!" =>
    public shoo(): void {
        this.isConfiguringGame = false;
        this.waitingService.isWaiting.next(false);
    }

    private useConfiguration(): void {
        this.isConfiguringGame = false;
        this.waitingService.isWaiting.next(true);
        const isJoiningGame = this.userChoiceService.createOrJoin === CreateOrJoin.join;
        if (isJoiningGame) {
            this.gameService.joinGame(this.availableGamesComponent.chosenGame);
        }
        else {
            this.gameHttpService.createGame(this.userChoiceService.toGameConfiguration())
                .then((gameId) => {
                    this.gameService.joinGame(gameId);
                });
        }
    }

}

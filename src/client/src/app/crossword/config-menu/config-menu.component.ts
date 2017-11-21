import { Component, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MenuAutomatonService } from './menu-automaton.service';
import { GameHttpService } from '../services/game-http.service';
import { UserChoiceService, CreateOrJoin } from './user-choice.service';
import { GameService, GameState } from '../game.service';
import { WaitingService } from './waiting/waiting.service';
import { GameManagerService } from '../services/game-manager.service';

@Component({
    selector: 'app-config-menu',
    templateUrl: './config-menu.component.html',
    styleUrls: ['./config-menu.component.css'],
    providers: [
        MenuAutomatonService
    ]
})
export class ConfigMenuComponent implements AfterViewInit, OnDestroy {

    public shouldShowAvailableGames = false;

    private subscriptions: Subscription[] = [];

    constructor(public menuAutomaton: MenuAutomatonService,
                public waitingService: WaitingService,
                private gameService: GameService,
                private ngZone: NgZone) { }

    public ngAfterViewInit(): void {
        const chooseGameArriveSubscription = this.menuAutomaton.states.chooseGame.arrive.subscribe(
            () => this.shouldShowAvailableGames = true
        );
        const chooseGameLeaveSubscription = this.menuAutomaton.states.chooseGame.leave.subscribe(
            () => this.shouldShowAvailableGames = false
        );
        const configEndSubscription = this.menuAutomaton.configEnd.subscribe(
            () => this.gameService.state.next(GameState.waiting)
        );
        const stopDisplayingSubscription = this.waitingService.isWaiting.subscribe(
            () => this.ngZone.run(() => {})
        );
        this.subscriptions.push(
            chooseGameArriveSubscription,
            chooseGameLeaveSubscription,
            configEndSubscription,
            stopDisplayingSubscription
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    public get shouldBeDisplayed(): boolean {
        return this.gameService.stateValue === GameState.configuring || this.waitingService.isWaitingValue;
    }

}

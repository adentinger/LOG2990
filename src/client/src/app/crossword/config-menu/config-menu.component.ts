import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MenuAutomatonService } from './menu-automaton.service';
import { AvailableGamesComponent } from './available-games/available-games.component';

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

    private subscriptions: Subscription[] = [];
    @ViewChild(AvailableGamesComponent)
    private availableGamesComponent: AvailableGamesComponent;

    constructor(public menuAutomaton: MenuAutomatonService) { }

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
            () => this.isConfiguringGame = false
        );
        this.subscriptions.push(chooseGameArriveSubscription, chooseGameLeaveSubscription, configEndSubscription);
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

}

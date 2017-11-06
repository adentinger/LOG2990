import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MenuAutomatonService } from './menu-automaton.service';
import { AvailableGamesComponent } from './available-games/available-games.component';
import { GameHttpService } from '../services/game-http.service';
import { GameId } from '../../../../../common/src/communication/game-configs';
import { CreateOrJoin } from './menu-automaton-choices';

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
    @Output()
    public gameId = new EventEmitter<GameId>();

    private subscriptions: Subscription[] = [];
    @ViewChild(AvailableGamesComponent)
    private availableGamesComponent: AvailableGamesComponent;

    constructor(public menuAutomaton: MenuAutomatonService,
                private gameService: GameHttpService) { }

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
            () => {
                this.isConfiguringGame = false;
                const userChoices = this.menuAutomaton.choices;
                if (userChoices.createOrJoin === CreateOrJoin.create) {
                    this.gameService.requestGame(userChoices.toGameConfiguration())
                        .then((gameId) => {
                            this.gameId.emit(gameId);
                        });
                }
                else {
                    this.gameId.emit(userChoices.chosenGame);
                }
            }
        );
        this.subscriptions.push(chooseGameArriveSubscription, chooseGameLeaveSubscription, configEndSubscription);
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

}

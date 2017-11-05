import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuAutomatonService } from './menu-automaton.service';
import { Subscription } from 'rxjs/Subscription';

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
    private subscriptions: Subscription[] = [];

    constructor(public menuAutomaton: MenuAutomatonService) {
        const subscription = this.menuAutomaton.configEnd.subscribe(
            () => this.isConfiguringGame = false
        );
        this.subscriptions.push(subscription);
    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    public log(...args): void {
        console.log(...args);
    }

}

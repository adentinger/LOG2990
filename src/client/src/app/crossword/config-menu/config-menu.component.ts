import { Component, OnInit } from '@angular/core';

import { ConfigMenuService, MENU_CONFIG_URL } from './config-menu.service';
import { ConfigMenuState } from './config-menu-state';
import { ConfigMenuOption, FetchedPendingGame } from './config-menu-option';

@Component({
    selector: 'app-config-menu',
    templateUrl: './config-menu.component.html',
    styleUrls: ['./config-menu.component.css'],
    providers: [
        ConfigMenuService,
        { provide: MENU_CONFIG_URL, useValue: '/assets/crossword/config-menu-pages.json' }
    ]
})
export class ConfigMenuComponent implements OnInit {

    public ngOnInit() {
    }

    get currentState(): ConfigMenuState {
        return this.configMenuService.getCurrentState();
    }

    get currentOptions(): string[] {
        if (Array.isArray(this.currentState.options)) {
            return this.currentState.options.map((value: ConfigMenuOption) => value.name);
        } else {
            return this.currentState.options.fetchedOptions.map((option: FetchedPendingGame) =>
                FetchedPendingGame.prototype.toString.apply(option));
        }
    }

    get isConfiguringGame(): boolean {
        return this.configMenuService.isConfiguringGame;
    }

    set isConfiguringGame(flag: boolean) {
        this.configMenuService.isConfiguringGame = flag;
    }

    public getObjectEntries(object: any): [any, any][] {
        return Object.entries(object);
    }

    constructor(private configMenuService: ConfigMenuService) { }

    public selectOption(id: number) {
        this.configMenuService.selectOption(id);
    }

    public stateBack() {
        this.configMenuService.goBackState();
    }

}

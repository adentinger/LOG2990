import { Component, OnInit } from '@angular/core';

import { ConfigMenuService } from './config-menu.service';
import { MENU_PAGES } from './menu-pages';
import { ConfigMenuState } from './config-menu-state';
import { ConfigMenuOption } from './config-menu-option';

@Component({
    selector: 'app-config-menu',
    templateUrl: './config-menu.component.html',
    styleUrls: ['./config-menu.component.css'],
    providers: [
        ConfigMenuService,
        { provide: 'menuPages', useValue: MENU_PAGES }
    ]
})
export class ConfigMenuComponent implements OnInit {

    get currentState(): ConfigMenuState {
        return this.configMenuService.getCurrentState();
    }

    get currentOptions(): string[] {
        if (Array.isArray(this.currentState.options)) {
            return this.currentState.options.map((value: ConfigMenuOption) => value.name);
        } else {
            return this.currentState.options.fetchedOptions;
        }
    }

    public getObjectEntries(object: any): [any, any][] {
        return Object.entries(object);
    }

    constructor(private configMenuService: ConfigMenuService) { }

    public selectOption(id: number) {
        this.configMenuService.selectOption(id);
    }

    public ngOnInit() {
    }

    public stateBack() {
        this.configMenuService.goBackState();
    }

}

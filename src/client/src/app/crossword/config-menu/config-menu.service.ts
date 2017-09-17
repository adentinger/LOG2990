import { Injectable, Inject } from '@angular/core';
import { ConfigMenuState } from './config-menu-state';

@Injectable()
export class ConfigMenuService {
    private states: ConfigMenuState[] = [];
    private currentState = -1;
    private gameConfiguration: any = {};

    constructor( @Inject('menuPages') private menuPages: any[]) {
        this.states.push.apply(this.states, ConfigMenuState.fromJson(menuPages));
        if (this.states.length > 0) {
            const firstState: ConfigMenuState = this.states.find((value: ConfigMenuState) => value.id === 0);
            if (!firstState) {
                this.states.splice(-1);
                throw TypeError('No state with id 0');
            }
            this.currentState = 0;
        }
    }

    public getCurrentState(): ConfigMenuState {
        return this.states[this.currentState];
    }

    public selectOption(optionId: number): void {
    }
}

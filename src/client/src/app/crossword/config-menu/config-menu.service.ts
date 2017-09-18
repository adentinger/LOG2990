import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConfigMenuState, PageId } from './config-menu-state';

export abstract class ConfigMenuStateConfirm extends ConfigMenuState {
    public readonly settings: any = {};
}

@Injectable()
export class ConfigMenuService {
    private static readonly STATE_CONFIRM = -1;
    private static readonly STATE_SEND = -2;
    private static confirmState: ConfigMenuStateConfirm = {
        id: ConfigMenuService.STATE_CONFIRM,
        name: 'Confirm Settings',
        settings: {},
        options: [
            {name: 'Start', nextPage: ConfigMenuService.STATE_SEND}
        ]
    };
    public isConfiguringGame = true;

    private states: ConfigMenuState[] = [];
    private currentStateId: PageId = -1;
    private gameConfiguration: any = {};
    private stateStack: number[] = [];

    constructor(private location: Location,
                private http: HttpClient,
                @Inject('menuPages') menuPages: any[]) {
        this.states.push.apply(this.states, ConfigMenuState.fromJson(menuPages));
        if (this.states.length > 0) {
            const firstState: ConfigMenuState = this.states.find((value: ConfigMenuState) => value.id === 0);
            if (!firstState) {
                this.states.splice(-1);
                throw TypeError('No state with id 0');
            }
            this.currentStateId = 0;
            this.states.push(ConfigMenuService.confirmState);
        }
    }

    public getCurrentState(): ConfigMenuState {
        return this.states.find((value) => value.id === this.currentStateId);
    }

    public selectOption(optionId: number): void {
        const currentState = this.getCurrentState();
        if (('fetchedOptions' in currentState.options &&
             optionId < currentState.options['fetchedOptions'].length) ||
            (Array.isArray(currentState.options) &&
             optionId < currentState.options.length)) {
            if (Array.isArray(currentState.options)) {
                this.gameConfiguration[currentState.name] = currentState.options[optionId].name;
                this.stateStack.push(this.currentStateId);
                this.currentStateId = currentState.options[optionId].nextPage;
            } else {
                this.gameConfiguration[currentState.name] = currentState.options.fetchedOptions[optionId];
                this.stateStack.push(this.currentStateId);
                this.currentStateId = currentState.options.nextPage;
            }
        }
        if (this.currentStateId === ConfigMenuService.STATE_CONFIRM) {
            (this.getCurrentState())['settings'] = this.gameConfiguration;
        }
        if (this.currentStateId === ConfigMenuService.STATE_SEND) {
            delete this.gameConfiguration[currentState.name];
            this.sendGameConfiguration();
        }
    }

    public goBackState(): void {
        if (this.stateStack.length === 0) {
            this.location.back();
        } else {
            this.currentStateId = this.stateStack.slice(-1)[0];
            this.stateStack.pop();
        }
        const currentState = this.getCurrentState();
        delete this.gameConfiguration[currentState.name];
    }

    public sendGameConfiguration(): void {
        this.isConfiguringGame = false;
    }
}

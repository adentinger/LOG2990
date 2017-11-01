import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConfigMenuState, PageId } from './config-menu-state';
import { FetchableOptionList, ConfigMenuOption, FetchedPendingGame } from './config-menu-option';
import { CrosswordGameService } from '../crossword-game.service';
import '../../../../../common/src/crossword/packets/game-join.parser';

export const MENU_CONFIG_URL = 'menuConfigUrl';

export interface Settings {
    [index: string]: string;
}

interface SavedSettings {
    [index: number]: number;
}

export abstract class ConfigMenuStateConfirm extends ConfigMenuState {
    public readonly settings: Settings = {};
}

@Injectable()
export class ConfigMenuService {

    private static readonly SERVER_ADDRESS = 'http://localhost:3000';
    private static readonly GAMES_PATH = '/crossword/games/';
    private static readonly STATE_CONFIRM = -1;
    private static readonly STATE_SEND = -2;
    private static confirmState: ConfigMenuStateConfirm = {
        id: ConfigMenuService.STATE_CONFIRM,
        name: 'Confirm Settings',
        settings: {},
        options: [
            { name: 'Start', nextPage: ConfigMenuService.STATE_SEND }
        ]
    };
    public isConfiguringGame = true;

    private states: ConfigMenuState[] = [];
    private currentStateId: PageId;
    private gameConfiguration: SavedSettings = {};
    private stateStack: number[] = [];

    public createdGameId;

    constructor(private location: Location,
        private http: HttpClient,
        @Inject('menuConfigUrl') menuConfigUrl: string,
        private crosswordGameService: CrosswordGameService) {
        http.get(menuConfigUrl, { responseType: 'json' }).subscribe((menuPages) => {
            this.states.push.apply(this.states, ConfigMenuState.fromJson(menuPages, http));
            if (this.states.length > 0) {
                const firstState = this.states.find((value: ConfigMenuState) => value.id === 0);
                if (!firstState) {
                    this.states.splice(-1);
                    throw TypeError('No state with id 0');
                }
                this.currentStateId = 0;
                this.states.push(ConfigMenuService.confirmState);
            }
        });
    }

    public getCurrentState(): ConfigMenuState {
        return this.states.find((value) => value.id === this.currentStateId);
    }

    private nextState(optionId: number) {
        const currentState = this.getCurrentState();
        this.gameConfiguration[currentState.id] = optionId;
        this.stateStack.push(this.currentStateId);
        if (ConfigMenuState.hasFetchableOptions(currentState)) {
            this.currentStateId = (currentState.options as FetchableOptionList).nextPage;
        } else {
            this.currentStateId = currentState.options[optionId].nextPage;
        }
    }

    private getDisplayedSettings(): Object {
        const displayedSettings = {};
        for (const setting in this.gameConfiguration) {
            if (this.gameConfiguration.hasOwnProperty(setting)) {
                const state = this.states.find((value: ConfigMenuState) => value.id === +setting);
                let options: string[];
                if (ConfigMenuState.hasFetchableOptions(state)) {
                    options = (state.options as FetchableOptionList).fetchedOptions
                        .map((option: FetchedPendingGame) =>
                            FetchedPendingGame.prototype.toString.apply(option));
                } else {
                    options = (state.options as ConfigMenuOption[])
                        .map((option: ConfigMenuOption) => option.name);
                }
                displayedSettings[state.name] = options[this.gameConfiguration[setting]];
            }
        }
        return displayedSettings;
    }

    public selectOption(optionId: number): void {
        const currentState = this.getCurrentState();
        if (ConfigMenuState.hasFetchableOptions(currentState)) {
            if (optionId < currentState.options['fetchedOptions'].length) {
                this.nextState(optionId);
            }
        } else if (optionId < (currentState.options as ConfigMenuOption[]).length) {
            this.nextState(optionId);
        }
        if (this.currentStateId === ConfigMenuService.STATE_CONFIRM) {
            (this.getCurrentState())['settings'] = this.getDisplayedSettings();
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
        delete this.gameConfiguration[currentState.id];
    }

    private sendGameConfiguration(): void {
        console.log('sending to url: ' + ConfigMenuService.SERVER_ADDRESS + ConfigMenuService.GAMES_PATH);
        console.log('sending:' + this.getDisplayedSettings().toString());

        this.http.post(ConfigMenuService.SERVER_ADDRESS + ConfigMenuService.GAMES_PATH,
            this.getDisplayedSettings())
            .subscribe(
            (response) => {
                console.log('response on client: ' + JSON.stringify(response));
                this.crosswordGameService.setGameId(response['id']);
                // get informations to init game on client
            },
            (error: Error) => {
                console.log('error on client : ' + error.message);
            });
        this.isConfiguringGame = false;
    }

}

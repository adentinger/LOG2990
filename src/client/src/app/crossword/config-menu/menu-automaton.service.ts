import { Injectable } from '@angular/core';
import { MenuState } from './menu-state';

/**
 * @class MenuAutomatonService
 * @description Represents the Finite State Machine of the configuration menu.
 * For example, with choice '1' (2-player game) while in 'Player Number?' state,
 * we go to state 'Create or Join?'.
 *
 * See doc/architectures/ConfigurationMenu_FSA.jpg
 */
@Injectable()
export class MenuAutomatonService {

    private states: MenuState[];
    private path: MenuState[] = [];
    private stateInternal: MenuState = null;

    constructor() {
        const gameMode = new MenuState('Select game mode');
        const playerNumber = new MenuState('Select number of players');
        const difficulty = new MenuState('Select difficulty');
        const createOrJoin = new MenuState('Create or join game?');
        const chooseGame = new MenuState('Choose game');
        const confirm = new MenuState('Confirm choice?');
    }

    public get state(): MenuState {
        return this.stateInternal;
    }

}

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

    constructor() {}

    public get state(): MenuState {
        return this.stateInternal;
    }

}

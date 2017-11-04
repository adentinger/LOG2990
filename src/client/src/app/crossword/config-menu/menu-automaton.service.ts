import { Injectable } from '@angular/core';
import { MenuState, Option } from './menu-state';

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
        // Create states
        const gameMode = new MenuState('Select game mode');
        const playerNumber = new MenuState('Select number of players');
        const difficulty = new MenuState('Select difficulty');
        const createOrJoin = new MenuState('Create or join game?');
        const chooseGame = new MenuState('Choose game');
        const confirm = new MenuState('Confirm choice?');

        // Add state transitions
        gameMode.addOption({name: 'Classic', nextState: playerNumber});
        gameMode.addOption({name: 'Dynamic', nextState: playerNumber});

        playerNumber.addOption({name: 'One player', nextState: difficulty});
        playerNumber.addOption({name: 'Two players', nextState: createOrJoin});

        difficulty.addOption({name: 'Easy', nextState: confirm});
        difficulty.addOption({name: 'Normal', nextState: confirm});
        difficulty.addOption({name: 'Hard', nextState: confirm});

        createOrJoin.addOption({name: 'Create game', nextState: difficulty});
        createOrJoin.addOption({name: 'Join game', nextState: chooseGame});

        chooseGame.addOption({name: 'Done', nextState: confirm});

        confirm.addOption({name: 'Start', nextState: MenuState.none});

        // Setup things
        this.stateInternal = gameMode;
        this.states = [gameMode, playerNumber, difficulty, createOrJoin, chooseGame, confirm];
    }

    public get state(): MenuState {
        return this.stateInternal;
    }

    public chooseOption(option: Option): void {
    }

}

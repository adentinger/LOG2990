import { Injectable } from '@angular/core';
import { MenuState, Option } from './menu-state';
import { Subject } from 'rxjs/Subject';

interface States {
    gameMode:     MenuState;
    playerNumber: MenuState;
    difficulty:   MenuState;
    createOrJoin: MenuState;
    chooseGame:   MenuState;
    confirm:      MenuState;
}

interface Transition {
    state: MenuState;
    option: Option;
}

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

    private states: States;
    private path: Transition[];
    private stateInternal: MenuState = null;

    constructor() {
        this.initialize();
    }

    public get configEnd(): Subject<void> {
        return this.states.confirm.arrive;
    }

    public get chooseGame(): Subject<void> {
        return this.states.chooseGame.arrive;
    }

    private initialize(): void {
        this.createStates();
        this.addStateTransitions();
        this.moveToInitialState();
    }

    private createStates(): void {
        this.states = {
            gameMode: new MenuState('Select game mode'),
            playerNumber: new MenuState('Select number of players'),
            difficulty: new MenuState('Select difficulty'),
            createOrJoin: new MenuState('Create or join game?'),
            chooseGame: new MenuState('Choose game'),
            confirm: new MenuState('Confirm choice?')
        };
    }

    private addStateTransitions(): void {
        this.states.gameMode.addOption({name: 'Classic', nextState: this.states.playerNumber});
        this.states.gameMode.addOption({name: 'Dynamic', nextState: this.states.playerNumber});

        this.states.playerNumber.addOption({name: 'One player', nextState: this.states.difficulty});
        this.states.playerNumber.addOption({name: 'Two players', nextState: this.states.createOrJoin});

        this.states.difficulty.addOption({name: 'Easy', nextState: this.states.confirm});
        this.states.difficulty.addOption({name: 'Normal', nextState: this.states.confirm});
        this.states.difficulty.addOption({name: 'Hard', nextState: this.states.confirm});

        this.states.createOrJoin.addOption({name: 'Create game', nextState: this.states.difficulty});
        this.states.createOrJoin.addOption({name: 'Join game', nextState: this.states.chooseGame});

        this.states.chooseGame.addOption({name: 'Done', nextState: this.states.confirm});

        this.states.confirm.addOption({name: 'Start', nextState: MenuState.none});
    }

    private moveToInitialState(): void {
        this.path = [{state: this.states.gameMode, option: null}];
        this.stateInternal = this.states.gameMode;
    }

    public get state(): MenuState {
        return this.stateInternal;
    }

    public chooseOption(option: Option): void {
        const index = this.state.options.findIndex(
            optionOfState => optionOfState === option
        );
        const found = index >= 0;
        if (found) {
            this.path.push({state: this.state, option: option});
            this.stateInternal = option.nextState;
        }
        else {
            throw new Error(`Option inexistant.`);
        }
    }

    public goBack(): void {
        if (this.path.length >= 2) {
            this.path.pop();
            this.stateInternal = this.path[this.path.length - 1].state;
        }
        else if (this.path.length === 1) {
            this.path.pop();
            this.moveToInitialState();
        }
        else {
            throw new Error('Cannot go back: already at the initial configuration menu');
        }
    }


}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { MenuState, Option } from './menu-state';
import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';
import { MenuAutomatonChoices } from './menu-automaton-choices';

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

    public get state(): MenuState {
        return this.stateInternal;
    }

    public get configEnd(): Subject<void> {
        return this.states.confirm.leave;
    }

    public get chooseGameArrive(): Subject<void> {
        return this.states.chooseGame.arrive;
    }

    public get chooseGameLeave(): Subject<void> {
        return this.states.chooseGame.leave;
    }

    private initialize(): void {
        this.createStates();
        this.addStateTransitions();
        this.moveToInitialState();
    }

    private createStates(): void {
        this.states = {
            gameMode: new MenuState('Select game mode', 'gameMode'),
            playerNumber: new MenuState('Select number of players', 'playerNumber'),
            difficulty: new MenuState('Select difficulty', 'difficulty'),
            createOrJoin: new MenuState('Create or join game?', 'createJoin'),
            chooseGame: new MenuState('Choose game', 'gameId'),
            confirm: new MenuState('Confirm choice?', null)
        };
    }

    private addStateTransitions(): void {
        this.states.gameMode.addOption({name: 'Classic', nextState: this.states.playerNumber, value: GameMode.Classic});
        this.states.gameMode.addOption({name: 'Dynamic', nextState: this.states.playerNumber, value: GameMode.Dynamic});

        this.states.playerNumber.addOption({name: 'One player', nextState: this.states.difficulty, value: 1});
        this.states.playerNumber.addOption({name: 'Two players', nextState: this.states.createOrJoin, value: 2});

        this.states.difficulty.addOption({name: 'Easy', nextState: this.states.confirm, value: Difficulty.easy});
        this.states.difficulty.addOption({name: 'Normal', nextState: this.states.confirm, value: Difficulty.medium});
        this.states.difficulty.addOption({name: 'Hard', nextState: this.states.confirm, value: Difficulty.hard});

        this.states.createOrJoin.addOption({name: 'Create game', nextState: this.states.difficulty});
        this.states.createOrJoin.addOption({name: 'Join game', nextState: this.states.chooseGame});

        this.states.chooseGame.addOption({name: 'Done', nextState: this.states.confirm});

        this.states.confirm.addOption({name: 'Start', nextState: MenuState.none});
    }

    private moveToInitialState(): void {
        if (this.stateInternal != null) {
            this.stateInternal.leave.next();
        }
        this.stateInternal = this.states.gameMode;
        this.states.gameMode.arrive.next();
        this.path = [];
    }

    public chooseOption(option: Option): void {
        const index = this.state.options.findIndex(
            optionOfState => optionOfState === option
        );
        const found = index >= 0;
        if (found) {
            this.state.leave.next();
            this.path.push({state: this.state, option: option});
            this.stateInternal = option.nextState;
            this.state.arrive.next();
        }
        else {
            throw new Error(`Option inexistant.`);
        }
    }

    public goBack(): void {
        if (this.path.length >= 2) {
            this.stateInternal = this.path.pop().state;
        }
        else if (this.path.length === 1) {
            this.path.pop();
            this.moveToInitialState();
        }
        else {
            throw new Error('Cannot go back: already at the initial configuration menu');
        }
    }

    public get choices(): MenuAutomatonChoices {
        const choices = new MenuAutomatonChoices();
        this.path.forEach((transition) => {
            if (transition.state.fieldName !== null && transition.option !== null) {
                choices[transition.state.fieldName] = transition.option.value;
            }
        });
        return choices;
    }

}

import { TestBed, inject } from '@angular/core/testing';

import { MenuAutomatonService } from './menu-automaton.service';

describe('MenuAutomatonService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [MenuAutomatonService]
        });
    });

    let menuAutomaton: MenuAutomatonService;

    beforeEach(inject([MenuAutomatonService], (injectedMenuAutomaton) => {
        menuAutomaton = injectedMenuAutomaton;
    }));

    it('should be created', () => {
        expect(menuAutomaton).toBeTruthy();
    });

    describe('chooseOption', () => {

        it('should accept an existing option', () => {
            const initialState = menuAutomaton.state;
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            expect(menuAutomaton.state).toBeTruthy();
            expect(menuAutomaton.state).not.toEqual(initialState);
        });

        it('should not accept an option that does not exist', () => {
            expect(() => menuAutomaton.chooseOption(null)).toThrow();
        });

    });

    describe('goBack', () => {

        it('should move us back by one state where we are not at the initial state', () => {
            const state0 = menuAutomaton.state;
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            const state1 = menuAutomaton.state;
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            menuAutomaton.goBack();
            expect(menuAutomaton.state).toEqual(state1);
            menuAutomaton.goBack();
            expect(menuAutomaton.state).toEqual(state0);
        });

        it('should throw an error when we are at the initial state', () => {
            expect(() => menuAutomaton.goBack()).toThrow();
        });

    });

    it('should set up to one callback to be called when the configuration ends', () => {
        let i = 0;
        let wasCallbackCalled = false;
        const callback = () => wasCallbackCalled = true;
        menuAutomaton.configEnd.subscribe(callback);
        while (i < 1000) {
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            ++i;
        }
        expect(wasCallbackCalled).toEqual(true);
    });

    it('should yield a game configuration', () => {
        let i = 0;
        let wasCallbackCalled = false;
        const callback = () => wasCallbackCalled = true;
        menuAutomaton.configEnd.subscribe(callback);
        while (i < 1000) {
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            ++i;
        }
        const configuration = menuAutomaton.getConfiguration; // should not throw
        expect(configuration).toBeTruthy();
    });

});

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

});

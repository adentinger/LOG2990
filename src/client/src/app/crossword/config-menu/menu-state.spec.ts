import { TestBed, inject } from '@angular/core/testing';

import { MenuState } from './menu-state';

describe('ConfigMenuService', () => {

    it('should be created', () => {
        expect(new MenuState()).toBeTruthy();
        const NAME = 'state1';
        const OPTIONS = [{name: 'option1', nextState: null}];
        const state = new MenuState(NAME, OPTIONS);
        expect(state.name).toEqual(NAME);
        expect(state.options).toEqual(OPTIONS);
        expect(state.options).not.toBe(OPTIONS);
    });

});

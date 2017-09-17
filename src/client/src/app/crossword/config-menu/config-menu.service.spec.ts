import { TestBed, inject } from '@angular/core/testing';

import { ConfigMenuService } from './config-menu.service';
import { MENU_PAGES } from './menu-pages';
import { ConfigMenuState } from './config-menu-state';
import { ConfigMenuOption } from './config-menu-option';

const mockStates1: ConfigMenuState[] = [
    {
        id: 0,
        name: 'Setting0',
        options: [
            {name: 'Option0', nextPage: 1},
            {name: 'Option1', nextPage: 1}
        ]
    },
    {
        id: 1,
        name: 'Setting1',
        options: [
            {name: 'Option0', nextPage: -1},
            {name: 'Option1', nextPage: -1}
        ]
    }
];

describe('ConfigMenuService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ConfigMenuService,
                { provide: 'menuPages', useValue: MENU_PAGES }
            ]
        });
    });

    let service: ConfigMenuService;
    beforeEach(inject([ConfigMenuService], (injectedService: ConfigMenuService) => {
        service = injectedService;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be in the right default state', () => {
        const state: ConfigMenuState = service.getCurrentState();
        expect(state).toBeDefined();
        expect(state.id).toBe(0);
        expect(state.name).toBe(MENU_PAGES[0].name);
        for (const option of (MENU_PAGES[0].options as ConfigMenuOption[])) {
            expect(state.options).toContain(option);
        }
    });

    it('should change state when an option is selected', () => {
        service['states'] = mockStates1;
        expect(service['currentState']).toBe(0);
        expect('Setting0' in service['gameConfiguration']).toBeFalsy();
        service.selectOption(1);
        expect(service['currentState']).toBe(1);
        expect('Setting0' in service['gameConfiguration']).toBeTruthy();
        expect(service['gameConfiguration']['Setting0']).toBe('Option1');
    });
});

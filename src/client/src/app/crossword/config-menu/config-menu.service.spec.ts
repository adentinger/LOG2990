import { TestBed, inject } from '@angular/core/testing';

import { ConfigMenuService } from './config-menu.service';
import { MENU_PAGES } from './menu-pages';
import { ConfigMenuState } from './config-menu-state';

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
        expect(state.id).toBe(0, 'Wrong default state');
        expect(state.name).toBe(MENU_PAGES[0].name);
        expect(state.options).toBe(MENU_PAGES[0].options);
    });
});

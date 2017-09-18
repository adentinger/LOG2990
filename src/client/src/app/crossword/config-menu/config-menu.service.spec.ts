import { TestBed, inject } from '@angular/core/testing';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { ConfigMenuService } from './config-menu.service';
import { MENU_PAGES } from './menu-pages';
import { ConfigMenuState } from './config-menu-state';
import { ConfigMenuOption } from './config-menu-option';
import { HttpClient, HttpClientModule } from '@angular/common/http';

const mockStates1: ConfigMenuState[] = [
    {
        id: 0,
        name: 'Setting0',
        options: [
            { name: 'Option0', nextPage: 1 },
            { name: 'Option1', nextPage: 1 }
        ]
    },
    {
        id: 1,
        name: 'Setting1',
        options: [
            { name: 'Option0', nextPage: -1 },
            { name: 'Option1', nextPage: -1 }
        ]
    }
];

describe('ConfigMenuService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                ConfigMenuService,
                HttpClient,
                { provide: Location, useClass: SpyLocation },
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

    it('should change state when a valid option is selected', () => {
        service['states'] = mockStates1;
        expect(service['currentStateId']).toBe(0);
        expect('Setting0' in service['gameConfiguration']).toBeFalsy();
        service.selectOption(1);
        expect(service['currentStateId']).toBe(1);
        expect('Setting0' in service['gameConfiguration']).toBeTruthy();
        expect(service['gameConfiguration']['Setting0']).toBe('Option1');
    });

    it('should not change state when an invalid option is selected', () => {
        service['states'] = mockStates1;
        expect(service['currentStateId']).toBe(0);
        expect('Setting0' in service['gameConfiguration']).toBeFalsy();
        service.selectOption(2); // invalid option
        expect(service['currentStateId']).toBe(0);
        expect('Setting0' in service['gameConfiguration']).toBeFalsy();
    });

    it('should be able to go back to it previous state', () => {
        service['states'] = mockStates1;
        service['currentStateId'] = 1;
        service['gameConfiguration']['Setting0'] = 'Option1';
        service['stateStack'].push(0);
        service.goBackState();
        expect(service['currentStateId']).toBe(0);
        expect('Setting0' in service['gameConfiguration']).toBeFalsy();
    });
});

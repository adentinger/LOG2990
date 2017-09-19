import { TestBed, inject } from '@angular/core/testing';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { ConfigMenuService, MENU_CONFIG_URL } from './config-menu.service';
import { MENU_PAGES } from './menu-pages';
import { ConfigMenuState } from './config-menu-state';
import { ConfigMenuOption } from './config-menu-option';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

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
    const MOCK_MENU_CONFIG_URL = '/mock-config-url.json';
    let httpController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                ConfigMenuService,
                HttpClient,
                { provide: Location, useClass: SpyLocation },
                { provide: MENU_CONFIG_URL, useValue: MOCK_MENU_CONFIG_URL }
            ]
        });
        httpController = TestBed.get(HttpTestingController);
    });

    let service: ConfigMenuService;
    beforeEach(inject([ConfigMenuService], (injectedService: ConfigMenuService) => {
        service = injectedService;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service['currentStateId']).toBeUndefined();
        httpController.expectOne(MOCK_MENU_CONFIG_URL).flush(mockStates1);
        expect(service['currentStateId']).toEqual(0);
    });

    it('should be in the right default state', () => {
        httpController.expectOne(MOCK_MENU_CONFIG_URL).flush(mockStates1);

        const state: ConfigMenuState = service.getCurrentState();
        expect(state).toBeDefined();
        expect(state.id).toBe(0);
        expect(state.name).toBe(mockStates1[0].name);
        for (const option of (mockStates1[0].options as ConfigMenuOption[])) {
            expect(state.options).toContain(option);
        }
    });

    it('should change state when a valid option is selected', () => {
        httpController.expectOne(MOCK_MENU_CONFIG_URL).flush(mockStates1);
        const setting0 = 0;

        expect(service['currentStateId']).toBe(0);
        expect(setting0 in service['gameConfiguration']).toBeFalsy();
        service.selectOption(1);
        expect(service['currentStateId']).toBe(1);
        expect(setting0 in service['gameConfiguration']).toBeTruthy();
        expect(service['gameConfiguration'][0]).toBe(1);
    });

    it('should not change state when an invalid option is selected', () => {
        httpController.expectOne(MOCK_MENU_CONFIG_URL).flush(mockStates1);
        const setting0 = 0;

        expect(service['currentStateId']).toBe(0);
        expect(setting0 in service['gameConfiguration']).toBeFalsy();
        service.selectOption(2); // invalid option
        expect(service['currentStateId']).toBe(0);
        expect(setting0 in service['gameConfiguration']).toBeFalsy();
    });

    it('should be able to go back to a previous state', () => {
        httpController.expectOne(MOCK_MENU_CONFIG_URL).flush(mockStates1);
        const setting0 = 0;

        service['currentStateId'] = 1;
        service['gameConfiguration'][0] = 1;
        service['stateStack'].push(0);
        service.goBackState();
        expect(service['currentStateId']).toBe(0);
        expect(setting0 in service['gameConfiguration']).toBeFalsy();
    });
});

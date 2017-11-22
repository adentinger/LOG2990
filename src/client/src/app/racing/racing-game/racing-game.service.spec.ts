import { TestBed, inject } from '@angular/core/testing';
import { ConnectionBackend, Http, RequestOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { RacingGameService } from './racing-game.service';
import { PhysicEngine } from './physic/engine';
import { UIInputs } from '../services/ui-input.service';
import { EventManager } from '../../event-manager.service';
import { MapService } from '../services/map.service';
import { CarsPositionsService } from './cars-positions.service';
import { SoundService } from '../services/sound-service';

describe('RacingGameService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RacingGameService,
                PhysicEngine,
                EventManager,
                MapService,
                { provide: ConnectionBackend, useClass: MockBackend },
                { provide: RequestOptions, useClass: BaseRequestOptions },
                Http,
                UIInputs,
                CarsPositionsService,
                SoundService
            ]
        });
    });

    let service: RacingGameService;

    beforeEach(inject([RacingGameService, UIInputs], (injectedService: RacingGameService,
        userInputs: UIInputs) => {
        service = injectedService;
        const CONTAINER = document.createElement('div') as HTMLDivElement;
        const HUD_CANVAS = document.createElement('canvas') as HTMLCanvasElement;
        service.initialize(CONTAINER, HUD_CANVAS, userInputs);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});

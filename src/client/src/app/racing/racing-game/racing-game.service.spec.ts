import { TestBed, inject } from '@angular/core/testing';

import { RacingGameService } from './racing-game.service';
import { MockMaps } from '../../admin-screen/map-editor/mock-maps';
import { MapConverterService } from '../../admin-screen/map-editor/map-converter.service';
import { PhysicEngine } from './physic/engine';
import { RacingUnitConversionService } from '../../admin-screen/map-editor/racing-unit-conversion.service';
import { UIInputs } from './ui-input.service';
import { EventManager } from '../../event-manager.service';

describe('RacingGameService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RacingGameService,
                PhysicEngine,
                MockMaps,
                MapConverterService,
                RacingUnitConversionService,
                EventManager,
                UIInputs
            ]
        });
    });

    let service: RacingGameService;

    beforeEach(inject([RacingGameService, MockMaps, MapConverterService, UIInputs, EventManager], (injectedService: RacingGameService,
        mockMapsProvider: MockMaps,
        mapConverterService: MapConverterService,
        eventManager: EventManager,
        userInputs: UIInputs) => {
        service = injectedService;
        const CANVAS = document.createElement('CANVAS') as HTMLCanvasElement;
        CANVAS.width = 1000;
        CANVAS.height = 500;
        service.initialise(CANVAS, mapConverterService.serialize(mockMapsProvider.functionalMap1()), userInputs, eventManager);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});

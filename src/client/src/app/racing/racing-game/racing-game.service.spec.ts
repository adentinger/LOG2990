import { TestBed, inject } from '@angular/core/testing';

import { RacingGameService } from './racing-game.service';
import { Point } from '../../../../../common/src/math/point';
import { MockMaps } from '../../admin-screen/map-editor/mock-maps';
import { MapConverterService } from '../../admin-screen/map-editor/map-converter.service';

describe('RacingGameService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RacingGameService
            ]
        });
    });

    let service: RacingGameService;

    beforeEach(inject([RacingGameService, MockMaps], (injectedService: RacingGameService,
        mockMapsProvider: MockMaps,
        mapConverterService: MapConverterService) => {
        service = injectedService;
        const CANVAS = document.createElement('CANVAS') as HTMLCanvasElement;
        CANVAS.width = 1000;
        CANVAS.height = 500;
        service.initialise(CANVAS, mapConverterService.serialize(mockMapsProvider.functionalMap1()));
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    xdescribe('cursorPosition', () => {

        it('should move the internal mouse cursor', () => {
            const CAMERA_ROTATION = new Point(0.5, -0.78);
            // Should not throw
            service.cameraRotation = CAMERA_ROTATION;
        });

        it('should throw an error when the cursor is invalid', () => {
            const INITIAL_POSITION = service.cameraRotation;
            const INVALID_CURSORS: Point[] = [
                new Point(-1.001, 0), new Point(1.001, 0),
                new Point(0, -1.001), new Point(0, 1.001),
                new Point(-1.001, -1.001), new Point(1.001, 1.001),
                new Point(-1.001, 1.001), new Point(1.001, -1.001)
            ];

            INVALID_CURSORS.forEach((point) => {
                expect(() => service.cameraRotation = point).toThrow();
                expect(service.cameraRotation).toBe(INITIAL_POSITION);
            });
        });

    });


});

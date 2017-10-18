import { TestBed, inject } from '@angular/core/testing';

import { RacingGameService } from './racing-game.service';
import { Point } from '../../common/math/point';

describe('RacingGameService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RacingGameService
            ]
        });
    });

    let service: RacingGameService;

    beforeEach(inject([RacingGameService], (injectedService: RacingGameService) => {
        service = injectedService;
        const CANVAS = document.createElement('CANVAS') as HTMLCanvasElement;
        CANVAS.width = 1000;
        CANVAS.height = 500;
        service.initialise(CANVAS);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('cursorPosition', () => {

        it('should move the internal mouse cursor', () => {
            const CURSOR_POSITION = new Point(0.5, -0.78);
            // Should not throw
            service.cursorPosition = CURSOR_POSITION;
        });

        it('should throw an error when the cursor is invalid', () => {
            const INITIAL_POSITION = service.cursorPosition;
            const INVALID_CURSORS: Point[] = [
                new Point(-1.001, 0), new Point(1.001, 0),
                new Point(0, -1.001), new Point(0, 1.001),
                new Point(-1.001, -1.001), new Point(1.001, 1.001),
                new Point(-1.001, 1.001), new Point(1.001, -1.001)
            ];

            INVALID_CURSORS.forEach((point) => {
                expect(() => service.cursorPosition = point).toThrow();
                expect(service.cursorPosition).toBe(INITIAL_POSITION);
            });
        });

    });


});

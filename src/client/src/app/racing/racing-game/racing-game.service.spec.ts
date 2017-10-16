import { TestBed, inject } from '@angular/core/testing';

import { RacingGameService } from './racing-game.service';

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
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should move an internal mouse cursor', () => {
        expect
    });


});

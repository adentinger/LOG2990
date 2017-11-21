import { TestBed, inject } from '@angular/core/testing';

import { GameStarterService } from './game-starter.service';

describe('GameStarterService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [GameStarterService]
        });
    });

    it('should be created', inject([GameStarterService], (service: GameStarterService) => {
        expect(service).toBeTruthy();
    }));

});

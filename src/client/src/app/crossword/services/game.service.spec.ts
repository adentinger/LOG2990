import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GameService } from './game.service';

describe('GameService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameService],
            imports: [
                HttpClientModule
            ]
        });
    });

    it('should be created', inject([GameService], (service: GameService) => {
        expect(service).toBeTruthy();
    }));
});

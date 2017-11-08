import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GameHttpService } from './game-http.service';

describe('GameHttpService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameHttpService],
            imports: [
                HttpClientModule
            ]
        });
    });

    it('should be created', inject([GameHttpService], (service: GameHttpService) => {
        expect(service).toBeTruthy();
    }));
});

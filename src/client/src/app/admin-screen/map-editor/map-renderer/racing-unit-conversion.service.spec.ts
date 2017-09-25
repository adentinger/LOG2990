import { TestBed, inject } from '@angular/core/testing';

import { RacingUnitConversionService } from './racing-unit-conversion.service';

describe('RacingUnitConversionService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RacingUnitConversionService]
        });
    });

    it('should be created', inject([RacingUnitConversionService], (service: RacingUnitConversionService) => {
        expect(service).toBeTruthy();
    }));

});

import { TestBed, inject } from '@angular/core/testing';

import { MapConverterService } from './map-converter.service';
import { RacingUnitConversionService } from './racing-unit-conversion.service';

describe('MapConverterService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MapConverterService,
                RacingUnitConversionService
            ]
        });
    });

    it('should be created', inject([MapConverterService], (service: MapConverterService) => {
        expect(service).toBeTruthy();
    }));

});

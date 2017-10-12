import { TestBed, inject } from '@angular/core/testing';

import { MapConverterService } from './map-converter.service';

describe('MapConverterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapConverterService]
    });
  });

  it('should be created', inject([MapConverterService], (service: MapConverterService) => {
    expect(service).toBeTruthy();
  }));
});

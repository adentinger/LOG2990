import { TestBed, inject } from '@angular/core/testing';

import { MapRendererService } from './map-renderer.service';

describe('MapRendererService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapRendererService]
    });
  });

  it('should be created', inject([MapRendererService], (service: MapRendererService) => {
    expect(service).toBeTruthy();
  }));
});

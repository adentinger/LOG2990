import { TestBed, inject } from '@angular/core/testing';

import { MapEditorService } from './map-editor.service';

describe('MapEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapEditorService]
    });
  });

  it('should be created', inject([MapEditorService], (service: MapEditorService) => {
    expect(service).toBeTruthy();
  }));
});

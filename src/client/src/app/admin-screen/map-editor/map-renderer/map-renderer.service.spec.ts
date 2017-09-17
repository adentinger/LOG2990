import { TestBed, inject } from '@angular/core/testing';

import { MapRendererService } from './map-renderer.service';
import { MapEditorService } from '../map-editor.service';

class CanvasFactory {
    constructor() {}

    public make(): HTMLCanvasElement {
        return document.createElement('canvas');
    }
}

describe('MapRendererService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MapRendererService, MapEditorService, CanvasFactory]
        });
    });

    it('should be created', inject([MapRendererService], (service: MapRendererService) => {
        expect(service).toBeTruthy();
    }));

    it('should accept a context',
       inject([MapRendererService, CanvasFactory],
              (service: MapRendererService, canvasFactory: CanvasFactory) => {
                  service.context = canvasFactory.make().getContext('2d');
              }));

    it('should refuse overriding existing context',
       inject([MapRendererService, CanvasFactory],
              (service: MapRendererService, canvasFactory: CanvasFactory) => {
                  service.context = canvasFactory.make().getContext('2d');
                  expect(() => {
                      service.context = canvasFactory.make().getContext('2d');
                  }).toThrowError(new RegExp('.*context.*'));
              }));
});

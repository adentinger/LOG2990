import { TestBed, inject } from '@angular/core/testing';

import { MapRendererService } from './map-renderer.service';
import { MapEditorService } from '../map-editor.service';
import { Point } from '../point';

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

    let mapRenderer: MapRendererService;
    let mapEditor: MapEditorService;
    beforeEach(inject([MapRendererService, MapEditorService],
                      (renderer: MapRendererService, editor: MapEditorService) => {
        mapRenderer = renderer;
        mapEditor = editor;
    }));

    it('should be created', inject([MapRendererService], (service: MapRendererService) => {
        expect(service).toBeTruthy();
    }));

    it('should accept a canvas',
       inject([MapRendererService, CanvasFactory],
              (service: MapRendererService, canvasFactory: CanvasFactory) => {
                  service.canvas = canvasFactory.make();
              }));

    it('should refuse overriding existing context',
       inject([MapRendererService, CanvasFactory],
              (service: MapRendererService, canvasFactory: CanvasFactory) => {
                  service.canvas = canvasFactory.make();
                  expect(() => {
                      service.canvas = canvasFactory.make();
                  }).toThrowError(new RegExp('.*context.*'));
              }));

    it ('should refuse drawing when canvas context is not set',
        inject([MapRendererService],
            (service: MapRendererService) => {
                expect(() => service.draw()).toThrowError(new RegExp('.*context.*'));
            }));

});

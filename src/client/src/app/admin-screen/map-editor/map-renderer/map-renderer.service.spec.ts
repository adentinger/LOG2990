import { TestBed, inject } from '@angular/core/testing';

import { MapRendererService } from './map-renderer.service';
import { MapEditorService } from '../map-editor.service';
import { MapConverterService } from '../map-converter.service';
import { RacingUnitConversionService } from '../racing-unit-conversion.service';
import { ItemGenerator } from '../item-generator';

class CanvasFactory {
    constructor() {}

    public make(): HTMLCanvasElement {
        return document.createElement('canvas');
    }
}

describe('MapRendererService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MapRendererService,
                MapEditorService,
                MapConverterService,
                RacingUnitConversionService,
                CanvasFactory,
                ItemGenerator
            ]
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

    it('should refuse overriding existing canvas',
       inject([MapRendererService, CanvasFactory],
              (service: MapRendererService, canvasFactory: CanvasFactory) => {
                  service.canvas = canvasFactory.make();
                  expect(() => {
                      service.canvas = canvasFactory.make();
                  }).toThrowError(new RegExp('.*canvas.*'));
              }));

    it ('should refuse drawing when canvas canvas is not set',
        inject([MapRendererService],
            (service: MapRendererService) => {
                expect(() => service.draw()).toThrowError(new RegExp('.*canvas.*'));
            }));

});

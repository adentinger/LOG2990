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

    describe('pointWithCoordinates', () => {

        const POINTS: Point[] = [
            new Point(50,   50),
            new Point(100, 100),
            new Point(150, 150),
            new Point(151, 149)
        ];

        beforeEach(() => {
            POINTS.forEach((point: Point) => {
                mapEditor.pushPoint(point);
            });
        });

        it('should be able to find a point with given coordinates', () => {
            const COORDINATES = new Point(98, 102);
            expect(mapRenderer['pointWithCoordinates'](COORDINATES)).toEqual(POINTS[1]);
        });

        it('should not find a point when there is none around given coordinates', () => {
            const COORDINATES = new Point(20, 50);
            expect(mapRenderer['pointWithCoordinates'](COORDINATES)).toEqual(null);
        });

        it('should find the above point when two points ovrelap', () => {
            const COORDINATES = new Point(150, 150);
            expect(mapRenderer['pointWithCoordinates'](COORDINATES)).toEqual(POINTS[3]);
        });

    });

});

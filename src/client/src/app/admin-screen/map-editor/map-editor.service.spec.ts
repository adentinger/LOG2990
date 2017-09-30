import { TestBed, inject } from '@angular/core/testing';

import { MockMaps } from './mock-maps';
import { MapEditorService } from './map-editor.service';
import { AbstractRacingUnitConversionService } from './abstract-racing-unit-conversion.service';
import { RacingUnitConversionService } from './map-renderer/racing-unit-conversion.service';
import { Point } from './point';

describe('MapEditorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MapEditorService,
                AbstractRacingUnitConversionService,
                    {
                        provide: AbstractRacingUnitConversionService,
                        useClass: RacingUnitConversionService
                    },
                MockMaps
            ]
        });
    });

    let service: MapEditorService;
    let mockMaps: MockMaps;

    beforeEach(inject([MapEditorService, MockMaps],
                      (injectedService: MapEditorService, mockMapFactory: MockMaps) => {
        service = injectedService;
        mockMaps = mockMapFactory;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service['map']).toBeTruthy();
    });

    it('should be able to replace a previous map', () => {
        const INITIAL_MAP = service['map'];
        expect(INITIAL_MAP).toBeTruthy();

        service.newMap();
        const NEW_MAP = service['map'];
        expect(NEW_MAP).toBeTruthy();
        expect(INITIAL_MAP).not.toBe(NEW_MAP);
    });

    it('should be able to check if a path loops back', () => {
        service['map'] = mockMaps.functionalMap1();
        expect(service['map'].isClosed()).toBe(true);
        service['map'] = mockMaps.emptyMap1();
        expect(service['map'].isClosed()).toBe(false);
    });

    it('should be able to add a valid point', () => {
        service['map'] = mockMaps.emptyMap1();
        service['map']['height'] = 500;
        service['map']['width'] = 500;

        expect(service['map'].path.points.length).toBe(0);
        const VALID_POINT: Point = new Point(3, 4);
        service.pushPoint(VALID_POINT);
        expect(service['map'].path.points.length).toBe(1);
        expect(service['map'].path.points).toContain(VALID_POINT);

        const INVALID_POINT: Point = new Point(1, 10000);
        service.pushPoint(INVALID_POINT);
        expect(service['map'].path.points.length).toBe(1);
        expect(service['map'].path.points).not.toContain(INVALID_POINT);
    });

    it('should be able to delete a point', () => {
        service['map'] = mockMaps.emptyMap1();
        const POINT: Point = new Point(3, 4);
        service['map'].path.points.push(POINT);

        expect(service['map'].path.points.length).toBe(1);
        service.popPoint();
        expect(service['map'].path.points.length).toBe(0);
    });

    it('should be able to edit a point', () => {
        service['map'] = mockMaps.functionalMap1();

        service.editPoint(0, new Point(3, 3));
        expect(service['map'].path.points[0].x).toBe(3);
        expect(service['map'].path.points[0].y).toBe(3);
        service.editPoint(0, new Point(-100, 10000));
        expect(service['map'].path.points[0].x).not.toBe(-100);
        expect(service['map'].path.points[0].y).not.toBe(10000);
    });

    it('should provide points', () => {
        service['map'] = mockMaps.functionalMap1();

        expect(service.path).toEqual(mockMaps.functionalMap1().path);
    });

});

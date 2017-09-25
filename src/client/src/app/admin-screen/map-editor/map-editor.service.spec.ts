import { TestBed, inject } from '@angular/core/testing';
import { emptyMap, functionalMap1, emptyMap2 } from './mock-maps';
import { MapEditorService } from './map-editor.service';
import { AbstractRacingUnitConversionService } from './abstract-racing-unit-conversion.service';
import { RacingUnitConversionService } from './map-renderer/racing-unit-conversion.service';
import { Point } from './point';

describe('MapEditorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MapEditorService,
                {
                    provide: AbstractRacingUnitConversionService,
                    useClass: RacingUnitConversionService
                }
            ]
        });
    });

    let service: MapEditorService;
    beforeEach(inject([MapEditorService], (injectedService: MapEditorService) => {
        service = injectedService;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service['map']).toBeTruthy();
    });

    it('should be able to replace a previous map', () => {
        const INITIAL_MAP = service['map'];
        expect(INITIAL_MAP).toBeTruthy();

        expect(service.newMap()).toBe(true);
        const NEW_MAP = service['map'];
        expect(NEW_MAP).toBeTruthy();
        expect(INITIAL_MAP).not.toBe(NEW_MAP);
    });

    it('should be able to delete a map', () => {
        service['map'] = Object.create(emptyMap);
        expect(service['map']).not.toBeFalsy();
        service.deleteMap();
        expect(service['map']).toBeNull();
    });

    it('should be able to check if a path loops back', () => {
        service['map'] = Object.create(functionalMap1);
        expect(service['map'].isClosed()).toBe(true);
        service['map'] = Object.create(emptyMap);
        expect(service['map'].isClosed()).toBe(false);
    });

    it('should be able to add a valid point', () => {
        service['map'] = Object.create(emptyMap);
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
        service['map'] = Object.create(emptyMap2);
        const POINT: Point = new Point(3, 4);
        service['map'].path.points.push(POINT);

        expect(service['map'].path.points.length).toBe(1);
        service.popPoint();
        expect(service['map'].path.points.length).toBe(0);
    });

    it('should be able to edit a point', () => {
        service['map'] = Object.create(functionalMap1);

        service.editPoint(0, new Point(3, 3));
        expect(service['map'].path.points[0].x).toBe(3);
        expect(service['map'].path.points[0].y).toBe(3);
        service.editPoint(0, new Point(-100, 10000));
        expect(service['map'].path.points[0].x).not.toBe(-100);
        expect(service['map'].path.points[0].y).not.toBe(10000);
    });

    it('should provide points', () => {
        service['map'] = Object.create(functionalMap1);

        expect(service.path).toBe(functionalMap1.path);
    });

});

import { TestBed, inject } from '@angular/core/testing';
import { emptyMap, functionalMap1, functionalMap2, disfunctionalMap } from './mock-maps';
import { MapEditorService } from './map-editor.service';
import { Point } from './point';
import { Puddle } from './puddle';
import { Pothole } from './pothole';
import { SpeedBoost } from './speed-boost';

describe('MapEditorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MapEditorService]
        });
    });

    let service: MapEditorService;
    beforeEach(inject([MapEditorService], (injectedService: MapEditorService) => {
        service = injectedService;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service['currentMap']).toBeTruthy();
    });

    it('should be able to replace a previous map', () => {
        const INITIAL_MAP = expect(service['currentMap']).toBeTruthy();
        expect(service.newMap()).toBe(true);
        const NEW_MAP = expect(service['currentMap']).toBeTruthy();
        expect(INITIAL_MAP).not.toEqual(NEW_MAP);
    });

    it('should be able to save a map', () => {
        service.saveMap().then((isSaved: boolean) => {
            expect(isSaved).toBe(true);
        }).catch(() => {
            expect(false).toBe(true);
        });
    });

    it('should be able to delete a map', () => {
        service['currentMap'] = Object.create(emptyMap);
        expect(service['currentMap']).not.toBeFalsy();
        service.deleteMap();
        expect(service['currentMap']).toBeNull();
    });

    it('should be able to check angles', () => {
        service['currentMap'] = Object.create(functionalMap1);
        expect(service['calculateAngle']({x: 1, y: 0}, {x: 0, y: 1})).toBeCloseTo(Math.PI / 2);
        expect(service['calculateAngle']({x: 1, y: 0}, {x: 1, y: 1})).toBeCloseTo(Math.PI / 4);
        expect(service.checkAngles().length).toEqual(0);
        service['currentMap'] = Object.create(disfunctionalMap);
        expect(service.checkAngles().length).toBeGreaterThan(0);
    });

    it('should be able to check if a path loops back', () => {
        service['currentMap'] = Object.create(functionalMap1);
        expect(service.checkPathLoopBack()).toBe(true);
        service['currentMap'] = Object.create(emptyMap);
        expect(service.checkPathLoopBack()).toBe(false);
    });

    it('should be able to check if lines cross', () => {
        service['currentMap'] = Object.create(disfunctionalMap);
        expect(service.checkLinesCross()).toContain([[{'x': 0, 'y': 2}, {'x': 11, 'y': 2}], [{'x': 0, 'y': 10}, {'x': 2, 'y': 1}]]);
        service['currentMap'] = Object.create(functionalMap1);
        expect(service.checkLinesCross()).toEqual([]);
    });

    it('should be able to add a valid point', () => {
        service['currentMap'] = Object.create(emptyMap);
        service['currentMap']['height'] = 500;
        service['currentMap']['width'] = 500;

        expect(service['currentMap'].path.points.length).toBe(0);
        const validPoint: Point = {x: 3, y: 4};
        service.pushPoint(validPoint);
        expect(service['currentMap'].path.points.length).toBe(1);
        expect(service['currentMap'].path.points).toContain(validPoint);

        const invalidPoint: Point = {x: -1, y: 10000};
        service.pushPoint(invalidPoint);
        expect(service['currentMap'].path.points.length).toBe(1);
        expect(service['currentMap'].path.points).not.toContain(invalidPoint);
    });

    it('should be able to delete a point', () => {
        service['currentMap'] = Object.create(emptyMap);
        const point: Point = {x: 3, y: 4};
        service['currentMap'].path.points.push(point);

        expect(service['currentMap'].path.points.length).toBe(1);
        service.popPoint();
        expect(service['currentMap'].path.points.length).toBe(0);
    });

    it('should be able to edit a point', () => {
        service['currentMap'] = Object.create(functionalMap1);

        service.editPoint();
        expect(service['currentMap'].path.points[0].x).not.toBe(0);
        expect(service['currentMap'].path.points[0].y).not.toBe(0);
    });

    it('should be able to place valid items', () => {
        service['currentMap'] = Object.create(functionalMap2);
        const puddle = new Puddle(12);
        const pothole = new Pothole(18);
        const speedBoost = new SpeedBoost(23);
        expect(service.addItem(puddle)).toBe(true);
        expect(service['currentMap'].puddles.length).toBeGreaterThan(0);
        expect(service['currentMap'].puddles[0]).toBe(puddle);
        expect(service.addItem(pothole)).toBe(true);
        expect(service['currentMap'].potholes.length).toBeGreaterThan(0);
        expect(service['currentMap'].potholes[0]).toBe(pothole);
        expect(service.addItem(speedBoost)).toBe(true);
        expect(service['currentMap'].speedBoosts.length).toBeGreaterThan(0);
        expect(service['currentMap'].speedBoosts[0]).toBe(speedBoost);

        service['currentMap'] = Object.create(functionalMap2);
        const invalidPuddle = new Puddle(0);
        const invalidPothole = new Pothole(0);
        const invalidSpeedBoost = new SpeedBoost(1000);
        expect(service.addItem(invalidPuddle)).toBe(false);
        expect(service['currentMap'].puddles.length).toEqual(0);
        expect(service.addItem(invalidPothole)).toBe(false);
        expect(service['currentMap'].potholes.length).toEqual(0);
        expect(service.addItem(invalidSpeedBoost)).toBe(false);
        expect(service['currentMap'].speedBoosts.length).toEqual(0);
    });
});

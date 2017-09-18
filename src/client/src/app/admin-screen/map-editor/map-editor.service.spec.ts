import { TestBed, inject } from '@angular/core/testing';
import { emptyMap, functionalMap1, functionalMap2, disfunctionalMap, disfunctionalMap2, emptyMap2, functionalMap3 } from './mock-maps';
import { MapEditorService } from './map-editor.service';
import { Point } from './point';
import { Puddle } from './puddle';
import { Pothole } from './pothole';
import { SpeedBoost } from './speed-boost';
import { Vector } from './vector';

type Line = [Point, Vector];

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
        expect(service['currentMap']).toBeFalsy();
    });

    it('can create map and replace previous map', () => {
        expect(service['currentMap']).toBeFalsy();
        expect(service.newMap()).toBe(true);
        expect(service['currentMap']).not.toBeFalsy();
        const map = Object.create(functionalMap1);
        service['currentMap'] = map;
        expect(service.newMap()).toBe(true);
        expect(service['currentMap']).not.toBe(map);
    });

    it('can save map', () => {
        service.saveMap().then((isSaved: boolean) => {
            expect(isSaved).toBe(true);
        }).catch(() => {
            expect(false).toBe(true);
        });
    });

    it('can delete map', () => {
        service['currentMap'] = Object.create(emptyMap);
        expect(service['currentMap']).not.toBeFalsy();
        service.deleteMap();
        expect(service['currentMap']).toBeNull();
    });

    it('can check angles', () => {
        service['currentMap'] = Object.create(functionalMap1);
        expect(service['calculateAngle']({x: 1, y: 0}, {x: 0, y: 1})).toBeCloseTo(Math.PI / 2);
        expect(service['calculateAngle']({x: 1, y: 0}, {x: 1, y: 1})).toBeCloseTo(Math.PI / 4);
        expect(service.checkAngles().length).toEqual(0);
        service['currentMap'] = Object.create(disfunctionalMap);
        expect(service.checkAngles().length).toBeGreaterThan(0);
    });

    it('can check if path loops back', () => {
        service['currentMap'] = Object.create(functionalMap1);
        expect(service.checkPathLoopBack()).toBe(true);
        service['currentMap'] = Object.create(emptyMap);
        expect(service.checkPathLoopBack()).toBe(false);
    });

    it('can check if lines cross', () => {
        service['currentMap'] = Object.create(disfunctionalMap);
        expect(service.checkLinesCross()).toContain([[{'x': 0, 'y': 2}, new Vector(10, 0)], [{'x': 0, 'y': 10}, new Vector(2, -9)]]);
        service['currentMap'] = Object.create(functionalMap1);
        expect(service.checkLinesCross()).toEqual([]);
        service['currentMap'] = Object.create(disfunctionalMap2);
        expect(service.checkLinesCross()).toContain([[{'x': 0, 'y': 0}, new Vector(10, 2)], [{'x': 0, 'y': 10}, new Vector(2, -9)]]);
    });

    it('can add a valid point', () => {
        service['currentMap'] = Object.create(emptyMap);
        service['currentMap'].height = 500;
        service['currentMap'].width = 500;

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

    it('can delete point', () => {
        service['currentMap'] = Object.create(emptyMap2);
        const point: Point = {x: 3, y: 4};
        service['currentMap'].path.points.push(point);

        expect(service['currentMap'].path.points.length).toBe(1);
        service.popPoint();
        expect(service['currentMap'].path.points.length).toBe(0);
    });

    it('can edit point', () => {
        service['currentMap'] = Object.create(functionalMap1);

        service.editPoint(0, 3, 3);
        expect(service['currentMap'].path.points[0].x).toBe(3);
        expect(service['currentMap'].path.points[0].y).toBe(3);
        service.editPoint(0, -100, 10000);
        expect(service['currentMap'].path.points[0].x).not.toBe(-100);
        expect(service['currentMap'].path.points[0].y).not.toBe(10000);
    });

    it('can place valid items', () => {
        service['currentMap'] = Object.create(functionalMap2);
        const puddle = new Puddle(12);
        const pothole = new Pothole(18);
        const speedBoost = new SpeedBoost(23);
        service.addItem(puddle);
        expect(service['currentMap'].puddles.length).toBeGreaterThan(0);
        expect(service['currentMap'].puddles[0]).toBe(puddle);
        service.addItem(pothole);
        expect(service['currentMap'].potholes.length).toBeGreaterThan(0);
        expect(service['currentMap'].potholes[0]).toBe(pothole);
        service.addItem(speedBoost);
        expect(service['currentMap'].speedBoosts.length).toBeGreaterThan(0);
        expect(service['currentMap'].speedBoosts[0]).toBe(speedBoost);

        service['currentMap'] = Object.create(functionalMap3);
        const invalidPuddle = new Puddle(0);
        const invalidPothole = new Pothole(0);
        const invalidSpeedBoost = new SpeedBoost(1000);
        service.addItem(invalidPuddle);
        expect(service['currentMap'].puddles.length).toEqual(0);
        service.addItem(invalidPothole);
        expect(service['currentMap'].potholes.length).toEqual(0);
        service.addItem(invalidSpeedBoost);
        expect(service['currentMap'].speedBoosts.length).toEqual(0);
    });

    it('can provide points', () => {
        service['currentMap'] = Object.create(functionalMap1);

        expect(service.getPath()).toBe(functionalMap1.path);
    });
});

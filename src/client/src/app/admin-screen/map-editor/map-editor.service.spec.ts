import { TestBed, inject } from '@angular/core/testing';
import { emptyMap, functionalMap1, functionalMap2, disfunctionalMap, disfunctionalMap2, emptyMap2, functionalMap3 } from './mock-maps';
import { MapEditorService } from './map-editor.service';
import { Point } from './point';
import { Puddle } from './puddle';
import { Pothole } from './pothole';
import { SpeedBoost } from './speed-boost';
import { Vector } from './vector';
import { Line } from './line';

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

    it('should be able to save a map', () => {
        service.saveMap().then((isSaved: boolean) => {
            expect(isSaved).toBe(true);
        }).catch(() => {
            expect(false).toBe(true);
        });
    });

    it('should be able to delete a map', () => {
        service['map'] = Object.create(emptyMap);
        expect(service['map']).not.toBeFalsy();
        service.deleteMap();
        expect(service['map']).toBeNull();
    });

    it('should be able to check angles', () => {
        service['map'] = Object.create(functionalMap1);
        expect(service['calculateAngle']({x: 1, y: 0}, {x: 0, y: 1})).toBeCloseTo(Math.PI / 2);
        expect(service['calculateAngle']({x: 1, y: 0}, {x: 1, y: 1})).toBeCloseTo(Math.PI / 4);
        expect(service['map'].checkAngles().length).toEqual(0);
        service['map'] = Object.create(disfunctionalMap);
        expect(service['map'].checkAngles().length).toBeGreaterThan(0);
    });

    it('should be able to check if a path loops back', () => {
        service['map'] = Object.create(functionalMap1);
        expect(service['map'].checkPathLoopBack()).toBe(true);
        service['map'] = Object.create(emptyMap);
        expect(service['map'].checkPathLoopBack()).toBe(false);
    });

    it('should be able to check if lines cross', () => {
        service['map'] = Object.create(disfunctionalMap);
        const CROSSING_LINES1: [Line, Line][] = [
            [
                new Line(new Point(0, 2),  new Point(10, 0)),
                new Line(new Point(0, 10), new Point(2,  1))
            ]
        ];
        expect(service['checkLinesCross']()).toEqual(CROSSING_LINES1);

        service['map'] = Object.create(functionalMap1);
        const CROSSING_LINES2: [Line, Line][] = [];
        expect(service['checkLinesCross']()).toEqual(CROSSING_LINES2);

        service['map'] = Object.create(disfunctionalMap2);
        const CROSSING_LINES3: [Line, Line][] = [
            [
                new Line(new Point(0, 0),  new Point(10, 2)),
                new Line(new Point(0, 10), new Point(2,  1))
            ]
        ];
        expect(service['checkLinesCross']()).toEqual(CROSSING_LINES3);
    });

    it('should be able to add a valid point', () => {
        service['map'] = Object.create(emptyMap);
        service['map']['height'] = 500;
        service['map']['width'] = 500;

        expect(service['map'].path.points.length).toBe(0);
        const VALID_POINT: Point = {x: 3, y: 4};
        service.pushPoint(VALID_POINT);
        expect(service['map'].path.points.length).toBe(1);
        expect(service['map'].path.points).toContain(VALID_POINT);

        const INVALID_POINT: Point = {x: -1, y: 10000};
        service.pushPoint(INVALID_POINT);
        expect(service['map'].path.points.length).toBe(1);
        expect(service['map'].path.points).not.toContain(INVALID_POINT);
    });

    it('should be able to delete a point', () => {
        service['map'] = Object.create(emptyMap2);
        const POINT: Point = {x: 3, y: 4};
        service['map'].path.points.push(POINT);

        expect(service['map'].path.points.length).toBe(1);
        service.popPoint();
        expect(service['map'].path.points.length).toBe(0);
    });

    it('should be able to edit a point', () => {
        service['map'] = Object.create(functionalMap1);

        service.editPoint(0, 3, 3);
        expect(service['map'].path.points[0].x).toBe(3);
        expect(service['map'].path.points[0].y).toBe(3);
        service.editPoint(0, -100, 10000);
        expect(service['map'].path.points[0].x).not.toBe(-100);
        expect(service['map'].path.points[0].y).not.toBe(10000);
    });

    it('should be able to place valid items', () => {
        service['map'] = Object.create(functionalMap2);
        const PUDDLE = new Puddle(12);
        const POTHOLE = new Pothole(18);
        const SPEED_BOOST = new SpeedBoost(23);
        service['addItem'](PUDDLE);
        expect(service['map'].puddles.length).toBeGreaterThan(0);
        expect(service['map'].puddles[0]).toBe(PUDDLE);
        service['addItem'](POTHOLE);
        expect(service['map'].potholes.length).toBeGreaterThan(0);
        expect(service['map'].potholes[0]).toBe(POTHOLE);
        service['addItem'](SPEED_BOOST);
        expect(service['map'].speedBoosts.length).toBeGreaterThan(0);
        expect(service['map'].speedBoosts[0]).toBe(SPEED_BOOST);

        service['map'] = Object.create(functionalMap3);
        const INVALID_PUDDLE = new Puddle(0);
        const INVALID_POTHOLE = new Pothole(0);
        const INVALID_SPEED_BOOST = new SpeedBoost(1000);
        service['addItem'](INVALID_PUDDLE);
        expect(service['map'].puddles.length).toEqual(0);
        service['addItem'](INVALID_POTHOLE);
        expect(service['map'].potholes.length).toEqual(0);
        service['addItem'](INVALID_SPEED_BOOST);
        expect(service['map'].speedBoosts.length).toEqual(0);
    });

    it('can provide points', () => {
        service['map'] = Object.create(functionalMap1);

        expect(service.path).toBe(functionalMap1.path);
    });
});

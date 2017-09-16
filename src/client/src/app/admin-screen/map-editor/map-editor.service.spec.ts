import { TestBed, inject } from '@angular/core/testing';
import { emptyMap, disfunctionalMap } from './mock-maps';
import { MapEditorService } from './map-editor.service';
import { Point } from './point';

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

    it('can create map', () => {
        expect(service.newMap()).toBe(true);
        expect(service['currentMap']).not.toBeFalsy();
    });

    it('can save map', () => {
        service.saveMap().then((isSaved: boolean) => {
            expect(isSaved).toBe(true);
        }).catch(() => {
            expect(false).toBe(true);
        });
    });

    it('can check angles', () => {
        expect(service.checkAngles()).toBe(true);
    });

    it('can check if path is finished', () => {
        expect(service.checkPathFinished()).toBe(true);
    });

    it('can check if lines cross', () => {
        service['currentMap'] = Object.create(disfunctionalMap);
        expect(service.checkLinesCross()).toContain([[{'x': 0, 'y': 2}, {'x': 11, 'y': 2}], [{'x': 0, 'y': 10}, {'x': 2, 'y': 1}]]);
    });

    it('can add point', () => {
        service['currentMap'] = Object.create(emptyMap);
        expect(service['currentMap'].path.points.length).toBe(0);
        const point: Point = {x: 3, y: 4};
        service.pushPoint(point);
        expect(service['currentMap'].path.points.length).toBe(1);
        expect(service['currentMap'].path.points).toContain(point);
    });

    it('won\'t add invalid point', () => {
        service['currentMap'] = Object.create(emptyMap);
        expect(service['currentMap'].path.points.length).toBe(0);
        const point: Point = {x: -1, y: 10000};
        service['currentMap'].height = 500;
        service['currentMap'].width = 500;
        service.pushPoint(point);
        expect(service['currentMap'].path.points.length).toBe(0);
    });

    it('can delete point', () => {
        service['currentMap'] = Object.create(emptyMap);
        const point: Point = {x: 3, y: 4};
        service['currentMap'].path.points.push(point);
        expect(service['currentMap'].path.points.length).toBe(1);
        service.popPoint();
        expect(service['currentMap'].path.points.length).toBe(0);
    });
});

// path finished
// 45 degrees
// line dont cross
// pop/push

// editPoint
// dragging
// place items
// change item count

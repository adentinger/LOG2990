import { TestBed, inject } from '@angular/core/testing';
import { emptyMap3, functionalMap4, disfunctionalMap3, disfunctionalMap4 } from './mock-maps';
import { Map } from './map';
import { Path } from './path';
import { Point } from './point';
import { Line } from './line';

describe('Map', () => {

    it('should be created', () => {
        expect(emptyMap3).toBeTruthy();
        expect(emptyMap3.height).toEqual(500);
        expect(emptyMap3.width).toEqual(500);
        expect(emptyMap3.path).toEqual(new Path());
        expect(emptyMap3.potholes).toEqual([]);
        expect(emptyMap3.puddles).toEqual([]);
        expect(emptyMap3.speedBoosts).toEqual([]);
    });

    it('should compute length', () => {
        expect(functionalMap4.computeLength()).toBeCloseTo(34.14);
        expect(emptyMap3.computeLength()).toEqual(0);
    });

    it('should return first stretch length', () => {
        expect(functionalMap4.firstStretchLength()).toEqual(10);
        expect(emptyMap3.firstStretchLength).toThrowError();
    });

    it('should check bad angles', () => {
        expect(functionalMap4.computeBadAngles()).toEqual([]);
        expect(emptyMap3.computeBadAngles()).toEqual([]);
        expect(disfunctionalMap3.computeBadAngles()).toEqual([[new Point(0, 2), new Point(10, 2), new Point(0, 10)],
                                                              [new Point(10, 2), new Point(0, 10), new Point(2, 1)]]);
    });

    it('should check if map is finished', () => {
        expect(functionalMap4.isClosed()).toBeTruthy();
        expect(emptyMap3.isClosed()).toBe(false);
        expect(disfunctionalMap4.isClosed()).toBe(false);
    });

    it('should be able to check if lines cross', () => {
        const MAP1: Map = Object.create(disfunctionalMap3);
        const CROSSING_LINES1: [Line, Line][] = [
            [
                new Line(new Point(0, 2),  new Point(10, 2)),
                new Line(new Point(0, 10), new Point(2,  1))
            ]
        ];
        expect(MAP1.computeCrossingLines()).toEqual(CROSSING_LINES1);

        const MAP2: Map = Object.create(functionalMap4);
        const CROSSING_LINES2: [Line, Line][] = [];
        expect(MAP2.computeCrossingLines()).toEqual(CROSSING_LINES2);

        const MAP3: Map = Object.create(disfunctionalMap4);
        const CROSSING_LINES3: [Line, Line][] = [
            [
                new Line(new Point(0, 2),  new Point(10, 2)),
                new Line(new Point(4, 5), new Point(5,  0))
            ]
        ];
        expect(MAP3.computeCrossingLines()).toEqual(CROSSING_LINES3);
    });
});

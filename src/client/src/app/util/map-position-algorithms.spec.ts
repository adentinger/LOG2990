import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Line } from '../../../../common/src/math/line';
import { Point } from '../../../../common/src/math/point';
import { } from 'jasmine';
import { MapPositionAlgorithms } from './map-position-algorithms';
import * as THREE from 'three';
import { Projection } from './projection';

// Simple Map for testing
const points = [new Point(3.0, 3.0),
new Point(7.0, 7.0),
new Point(12.0, 7.0),
new Point(13.0, 3.0),
new Point(12.0, 2.0),
new Point(9.0, 3.0)];

const lines = [new Line(points[0], points[1]),
new Line(points[1], points[2]),
new Line(points[2], points[3]),
new Line(points[3], points[4]),
new Line(points[4], points[5]),
new Line(points[5], points[0])];

describe('Map position algorithms', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
            ],
            declarations: [
            ],
            providers: [
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
    });

    it('should calculate the interpolation given a point and a line', () => {
        const line1 = new Line(new Point(0.0, 0.0), new Point(8.0, 0.0));
        const point1 = new Point(3.0, 3.0);

        const interpolation = MapPositionAlgorithms.getProjectionOnLine(point1, line1);

        expect(interpolation.distanceToSegment).toEqual(3.0);
        expect(interpolation.segment).toEqual(line1);
        expect(interpolation.interpolation).toEqual(3.0 / 8.0);
    });

    it('should calculate the interpolation given a point and a set of lines', () => {
        const thePosition = new Point(9.0, 6.0);

        const closestInterpolation = MapPositionAlgorithms.getClosestProjection(thePosition, lines);

        expect(closestInterpolation.distanceToSegment).toEqual(1.0);
        expect(closestInterpolation.segment).toEqual(lines[1]);
        expect(closestInterpolation.interpolation).toEqual(3.0 / 8.0);
    });

    it('should calculate the interpolations on all lines given a point and a set of lines', () => {
        const thePosition = new Point(9.0, 6.0);

        const allProjections: Projection[] = MapPositionAlgorithms.getAllProjections(thePosition, lines);

        expect(allProjections.length).toEqual(lines.length);

        expect(allProjections[3].distanceToSegment).toEqual(3.5 * Math.sqrt(2));
        expect(allProjections[3].interpolation).toEqual(0.5);
    });
});

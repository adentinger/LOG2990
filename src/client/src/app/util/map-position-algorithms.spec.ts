import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Line } from '../../../../common/src/math/line';
import { Point } from '../../../../common/src/math/point';
import { } from 'jasmine';
import { MapPositionAlgorithms } from './map-position-algorithms';
import * as THREE from 'three';
import { interpolate } from '@angular/core/src/view/util';

describe('Map position algorithms', () => {
    const line1 = new Line(new Point(0.0, 0.0), new Point(8.0, 0.0));

    const point1 = new THREE.Vector2(3.0, 3.0);

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
        const interpolation = MapPositionAlgorithms.getProjectionOnLine(point1, line1);

        expect(interpolation.distanceToSegment).toEqual(3.0);
        expect(interpolation.segment).toEqual(line1);
        expect(interpolation.interpolation).toEqual(3.0 / 8.0);
    });
});

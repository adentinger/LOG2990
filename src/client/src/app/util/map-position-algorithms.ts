import { Line } from '../../../../common/src/math/line';
import { Point } from '../../../../common/src/math/point';
import { Projection } from './projection';
import * as THREE from 'three';
import { interpolate } from '@angular/core/src/view/util';

export class MapPositionAlgorithms {

    public static getProjectionOnLine(position: Point, line: Line): Projection {
        const origin: Point = line.origin;
        const mainVector: Point = line.destination.substract(origin);
        const vectorToProject: Point = position.substract(origin);

        const interpolation: number = this.dot(vectorToProject, mainVector) / this.squaredNorm(mainVector);
        const interpolationPoint: Point = this.interpolate(line, interpolation);
        const distanceToSegment = position.distanceTo(interpolationPoint);

        return new Projection(interpolation, line, distanceToSegment);
    }

    public static getClosestProjection(position: Point, lines: Line[]): Projection {

        return new Projection(0, new Line(new Point(0, 0), new Point(0, 0)), 0);
    }

    public static getAllProjections(position: Point, lines: Line[]): Projection[] {

        return [new Projection(0, new Line(new Point(0, 0), new Point(0, 0)), 0)];
    }

    private static dot(vec1: Point, vec2: Point): number {
        return (vec1.x * vec2.x + vec1.x * vec2.y);
    }

    private static norm(vec: Point): number {
        return Math.sqrt(vec.x ** 2 + vec.y ** 2);
    }

    private static squaredNorm(vec: Point): number {
        return vec.x ** 2 + vec.y ** 2;
    }

    // interpolate an interpolation ratio [-1,1] on a vector
    private static interpolate(line: Line, interpolation: number): Point {
        const vector = line.destination.substract(line.origin);
        vector.x = interpolation * vector.x;
        vector.y = interpolation * vector.y;
        vector.add(line.origin);

        return vector;
    }
}

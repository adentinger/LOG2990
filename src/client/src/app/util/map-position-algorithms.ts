import { Line } from '../../../../common/src/math/line';
import { Point } from '../../../../common/src/math/point';
import { Projection } from './projection';
import { Vector } from '../../../../common/src/math/vector';
import { interpolate } from '@angular/core/src/view/util';

export class MapPositionAlgorithms {

    public static getProjectionOnLine(position: Point, line: Line): Projection {
        const origin: Point = line.origin;
        const pointVector: Vector = new Vector(position.x - origin.x, position.y - origin.y);
        const lineVector: Vector = new Vector(line.destination.x - origin.x, line.destination.y - origin.y);

        const dot: number = pointVector.scalar(lineVector);
        const interpolation: number = dot / this.squaredNorm(lineVector);

        const inversedOrigin = new Point(-origin.x, -origin.y);
        const interpolationPoint: Point = line.interpolate(interpolation).add(inversedOrigin);
        // console.log("interpolation point between from origin" + line.origin.x + line.origin.y + ": " + interpolationPoint.x, interpolationPoint.y);
        const distanceToSegment: number = position.distanceTo(interpolationPoint);

        return new Projection(interpolation, line, distanceToSegment);
    }

    public static getClosestProjection(position: Point, lines: Line[]): Projection {

        return new Projection(0, new Line(new Point(0, 0), new Point(0, 0)), 0);
    }

    public static getAllProjections(position: Point, lines: Line[]): Projection[] {
        const projections: Projection[] = [];
        for (const line of lines) {
            projections.push(this.getProjectionOnLine(position, line));
        }
        return projections;
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

    // interpolate from a ratio of vector
    private static interpolate(line: Line, interpolation: number): Point {
        const vector = line.destination.substract(line.origin);
        vector.x = interpolation * vector.x;
        vector.y = interpolation * vector.y;
        vector.add(line.origin);

        return vector;
    }
}

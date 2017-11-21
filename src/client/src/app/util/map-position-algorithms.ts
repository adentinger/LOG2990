import { Line } from '../../../../common/src/math/line';
import { Point } from '../../../../common/src/math/point';
import { Projection } from './projection';
import { Vector } from '../../../../common/src/math/vector';

export class MapPositionAlgorithms {

    public static getProjectionOnLine(position: Point, line: Line): Projection {
        const origin: Point = line.origin;
        const pointVector: Vector = new Vector(position.x - origin.x, position.y - origin.y);
        const lineVector: Vector = new Vector(line.destination.x - origin.x, line.destination.y - origin.y);

        const dot: number = pointVector.scalar(lineVector);
        const interpolation: number = dot / this.squaredNorm(lineVector);

        const interpolationPoint: Point = line.interpolate(interpolation);

        const distanceToSegment: number = interpolationPoint.distanceTo(position);
        console.log('distanceToSegment=' + distanceToSegment);

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

    private static squaredNorm(vec: Point): number {
        return vec.x ** 2 + vec.y ** 2;
    }
}

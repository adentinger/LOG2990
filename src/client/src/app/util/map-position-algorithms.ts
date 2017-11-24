import { Line } from '../../../../common/src/math/line';
import { Point } from '../../../../common/src/math/point';
import { Projection } from './projection';
import { Vector } from '../../../../common/src/math/vector';
import '../../../../common/src/math/clamp';
import { Meters } from '../types';
import { Progression } from '../racing/racing-game/racing-types';

export class MapPositionAlgorithms {

    public static getProjectionOnLine(position: Point, line: Line): Projection {
        const origin: Point = line.origin;
        const pointVector: Vector = new Vector(position.x - origin.x, position.y - origin.y);
        const lineVector: Vector = new Vector(line.destination.x - origin.x, line.destination.y - origin.y);

        const dot: number = pointVector.scalar(lineVector);
        const interpolation: number = dot / this.squaredNorm(lineVector);

        const interpolationPoint: Point = line.interpolate(interpolation);

        const distanceToSegment: number = interpolationPoint.distanceTo(position);

        return new Projection(interpolation, line, distanceToSegment);
    }

    public static getClosestProjection(position: Point, lines: Line[]): Projection {
        const projections: Projection[] = this.getAllProjections(position, lines);
        let closestProjection = projections[0];
        for (const projection of projections) {
            const projectionPoint = closestProjection.segment.interpolate(Math.clamp(closestProjection.interpolation, 0, 1));
            const pointOnLine = projectionPoint.substract(position);
            const distance = new Vector(pointOnLine.x, pointOnLine.y).norm();
            const projectionPoint2 = projection.segment.interpolate(Math.clamp(projection.interpolation, 0, 1));
            const pointOnLine2 = projectionPoint2.substract(position);
            const distance2 = new Vector(pointOnLine2.x, pointOnLine2.y).norm();
            if (distance2 < distance) {
                closestProjection = projection;
            }
        }
        return closestProjection;
    }

    public static getAllProjections(position: Point, lines: Line[]): Projection[] {
        const projections: Projection[] = [];
        for (const line of lines) {
            projections.push(this.getProjectionOnLine(position, line));
        }
        return projections;
    }

    public static getPointAtGivenDistance(distance: Meters, lines: Line[]): Point {
        distance %= MapPositionAlgorithms.getTrackLength(lines);
        const lineAtDistance = lines.find((line) => {
            const predicate = distance < line.length;
            if (!predicate) {
                distance -= line.length;
            }
            return predicate;
        });
        return lineAtDistance.interpolate(distance / lineAtDistance.length);
    }

    // public static getProgressOnWholeTrack(position: Point, lines: Line[]): Progression {
    //     const projection: Projection = MapPositionAlgorithms.getClosestProjection(position, lines);
    //     let progression: Progression = lines.findIndex((line) => line === projection.segment);
    // }

    public static getTrackLength(lines: Line[]): Meters {
        return lines.reduce((accumulatedLength, line) => accumulatedLength + line.length, 0);
    }

    private static squaredNorm(vec: Point): number {
        return vec.x ** 2 + vec.y ** 2;
    }
}

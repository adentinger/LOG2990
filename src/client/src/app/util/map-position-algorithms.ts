import { Line } from '../../../../common/src/math/line';
import * as THREE from 'three';
import { Point } from '../../../../common/src/math/point';

export class Projection {
    constructor(public readonly interpolation: number,
        public readonly segment: Line,
        public readonly distanceToSegment: number) { }
}

export class MapPositionAlgorithms {

    public static getClosestProjection(position: THREE.Vector2, lines: Line[]): Projection {

        return new Projection(0, new Line(new Point(0, 0), new Point(0, 0)), 0);
    }

    public static getProjectionOnLine(position: THREE.Vector2, lines: Line): Projection {

        return new Projection(0, new Line(new Point(0, 0), new Point(0, 0)), 0);
    }

    public static getAllProjections(position: THREE.Vector2, lines: Line): Projection {

        return new Projection(0, new Line(new Point(0, 0), new Point(0, 0)), 0);
    }
}

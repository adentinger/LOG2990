import { Line } from '../../../../common/src/math/line';
import { Point } from '../../../../common/src/math/point';
import { Projection } from './projection';

export class MapPositionAlgorithms {

    public static getProjectionOnLine(position: Point, lines: Line): Projection {

        return new Projection(0, new Line(new Point(0, 0), new Point(0, 0)), 0);
    }

    public static getClosestProjection(position: Point, lines: Line[]): Projection {

        return new Projection(0, new Line(new Point(0, 0), new Point(0, 0)), 0);
    }

    public static getAllProjections(position: Point, lines: Line[]): Projection[] {

        return [new Projection(0, new Line(new Point(0, 0), new Point(0, 0)), 0)];
    }
}

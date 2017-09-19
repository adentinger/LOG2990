import { Point } from './point';
import { Vector } from './vector';

export class Line {

    public origin: Point;
    public destination: Point;

    constructor(origin: Point,
                destination: Point) {
        this.origin = origin;
        this.destination = destination;
    }

    public get translation(): Vector {
        return Vector.fromPoints(this.origin, this.destination);
    }

}

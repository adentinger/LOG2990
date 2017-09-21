import { Point } from './point';

export class Path {
    public points: Point[] = [];

    constructor(points: Point[] = []) {
        this.points.push.apply(this.points, points);
    }
}

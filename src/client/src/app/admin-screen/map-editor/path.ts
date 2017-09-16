import { Point } from './point';

export class Path {

    public points: Point[] = [];

    constructor(context: CanvasRenderingContext2D,
                points: Point[] = [],
                width: number = 10,
                color: string = 'black') {
        this.points = points;
    }

}

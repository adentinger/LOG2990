import { Line } from './line';
import { Point } from './point';
import { Drawable } from './drawable';


export class Path implements Drawable {
    private context: CanvasRenderingContext2D;
    public points: Point[];

    constructor(context: CanvasRenderingContext2D,
                points: Point[] = []) {
        this.context = context;
        this.points = points;
    }

    public draw(): void {
        this.context.beginPath();
        this.points.forEach((point, index) => {
            point.draw();
            if (index !== 0) {
                this.context.lineTo(point.x, point.y);
            }
            else {
                this.context.moveTo(point.x, point.y);
            }
        });
    }
}

import { Point } from './point';
import { Drawable } from './drawable';

export class Line implements Drawable {
    private context: CanvasRenderingContext2D;
    public firstPoint: Point;
    public secondPoint: Point;
    public width: number;
    public color: string;

    constructor(context: CanvasRenderingContext2D,
                firstPoint: Point = new Point(context),
                secondPoint: Point = new Point(context),
                width: number = 5,
                color: string = 'orange') {
        this.context = context;
        this.firstPoint = firstPoint;
        this.secondPoint = secondPoint;
        this.width = width;
        this.color = color;
    }

    public draw(): void {
        this.context.beginPath();
        this.context.moveTo(this.firstPoint.x, this.firstPoint.y);
        this.context.lineTo(this.secondPoint.x, this.secondPoint.y);
        this.context.stroke();
    }
}

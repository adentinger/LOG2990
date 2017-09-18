import { Drawable } from './drawable';
import { Point } from '../point';

export class MapLine implements Drawable {

    protected context: CanvasRenderingContext2D;
    protected origin: Point;
    protected destination: Point;

    constructor(context: CanvasRenderingContext2D,
                origin: Point,
                destination: Point) {
        this.context = context;
        this.origin = origin;
        this.destination = destination;
    }

    public draw(): void {
        this.context.moveTo(this.origin.x, this.origin.y);
        this.context.lineTo(this.destination.x, this.destination.y);
        this.context.stroke();
    }

}

import { Drawable } from './drawable';
import { Point } from '../point';

export abstract class AbstractMapLine implements Drawable {

    private context: CanvasRenderingContext2D;
    private origin: Point;
    private destination: Point;

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

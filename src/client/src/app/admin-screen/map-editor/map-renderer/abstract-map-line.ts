import { Line } from '../line';
import { Drawable } from './drawable';
import { Point } from '../point';
import { AbstractMapLineColors } from './abstract-map-line-colors';

export abstract class AbstractMapLine extends Line implements Drawable {

    private context: CanvasRenderingContext2D;
    public readonly origin: Point;
    public readonly destination: Point;
    private colors: AbstractMapLineColors;
    private width: number;

    constructor(context: CanvasRenderingContext2D,
                origin: Point,
                destination: Point,
                colors: AbstractMapLineColors,
                width: number) {
        super(origin, destination);
        this.context = context;
        this.colors = colors;
        this.width = width;
    }

    public draw(): void {
        this.context.beginPath();
        this.context.moveTo(this.origin.x, this.origin.y);
        this.context.lineTo(this.destination.x, this.destination.y);

        this.context.strokeStyle = this.colors.getColorOf('line');
        this.context.lineWidth = this.width;
        this.context.stroke();
    }

}

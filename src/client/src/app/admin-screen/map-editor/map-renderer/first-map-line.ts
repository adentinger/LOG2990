import { AbstractMapLine } from './abstract-map-line';
import { Point } from '../point';
import { FirstMapLineColors } from './first-map-line-colors';

const WIDTH = 5;

const STARTING_GRID_LENGTH = 30.0;

export class FirstMapLine extends AbstractMapLine {

    constructor(context: CanvasRenderingContext2D,
                origin: Point,
                destination: Point) {
        super(context, origin, destination, new FirstMapLineColors(), WIDTH);
    }

    public draw(): void {
        this.drawStartingGrid();
        this.drawLineExtension();
    }

    private drawStartingGrid(): void {
        this.context.beginPath();
        this.context.lineWidth = WIDTH;
    }

    private drawLineExtension(): void {
        this.context.beginPath();
        if (this.translation.norm() > STARTING_GRID_LENGTH) {
            const EXTENSION_START =
                this.origin.toVector()
                    .plus(this.translation.normalized().times(STARTING_GRID_LENGTH));
            this.context.moveTo(EXTENSION_START.x, EXTENSION_START.y);
            this.context.lineTo(this.destination.x, this.destination.y);
            this.context.lineWidth = WIDTH;
            this.context.strokeStyle = this.colors.getColorOf('line');
            this.context.stroke();
        }
    }

}

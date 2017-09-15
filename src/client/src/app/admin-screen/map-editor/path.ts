import { Point } from './point';
import { Drawable } from './drawable';

export class Path {
    // private context: CanvasRenderingContext2D;
    public points: Point[] = [];
    // public width: number;
    // public color: string;

    constructor(context: CanvasRenderingContext2D,
                points: Point[] = [],
                width: number = 10,
                color: string = 'black') {
        //this.context = context;
        this.points = points;
        //this.width = width;
    }
    // tout en bas dans le point renderer
    /*public draw(): void {
        this.drawLines();
        this.drawPoints();
    }

    private drawLines(): void {
        this.context.beginPath();
        this.points.forEach((point, index) => {
            if (index !== 0) {
                this.context.lineWidth = this.width;
                this.context.strokeStyle = this.color;
                this.context.lineTo(point.x, point.y);
                this.context.stroke();
            }
            else {
                this.context.moveTo(point.x, point.y);
            }
        });
    }

    private drawPoints(): void {
        this.points.forEach(point => {
            point.draw();
        });
    }
*/
}

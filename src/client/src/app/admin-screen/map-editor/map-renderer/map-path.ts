import { Drawable } from './drawable';
import { Point } from '../point';
import { AbstractMapPoint } from './abstract-map-point';
import { NormalMapPoint } from './normal-map-point';
import { FirstMapPoint } from './first-map-point';
import { AbstractMapLine } from './abstract-map-line';
import { NormalMapLine } from './normal-map-line';

export class MapPath implements Drawable {

    private context: CanvasRenderingContext2D;
    private cursorCoordinates: Point = new Point(-100, -100);
    private activePoint: AbstractMapPoint = null;
    private points: AbstractMapPoint[];
    private lines: AbstractMapLine[];

    constructor(context: CanvasRenderingContext2D, points: Point[]) {
        this.context = context;
        this.updatePoints(points);
    }

    public updatePoints(points: Point[]): void {
        this.generatePointsFrom(points);
        this.generateLinesFrom(points);
    }

    private generatePointsFrom(points: Point[]): void {
        this.points = points.map((point: Point, index: number) => {
            if (index !== 0) {
                return new NormalMapPoint(this.context, point.x, point.y);
            }
            else { // I prefer a good ol' if-else, even though the else is not
                   // necessary.
                return new FirstMapPoint(this.context, point.x, point.y);
            }
        });
    }

    private generateLinesFrom(points: Point[]): void {
        let lastPoint: Point = null;
        const LINES: AbstractMapLine[] = [];
        points.forEach((point: Point, index: number) => {

            // TODO Erroneous lines ?

            const IS_FIRST_ITERATION = (lastPoint === null);
            if (!IS_FIRST_ITERATION) {
                LINES.push(new NormalMapLine(this.context, lastPoint, point));
            }
            lastPoint = point;
        });

        this.lines = LINES;
    }

    public draw(): void {
        this.updateActivePoint();
        this.drawLines();
        this.drawPoints();
    }

    private drawLines(): void {
        this.lines.forEach((line) => {
            line.draw();
        });
    }

    private drawPoints(): void {
        this.points.forEach((point: AbstractMapPoint) => {
            point.draw();
        });
    }

    public moveCursorTo(coordinates: Point): void {
        this.cursorCoordinates = coordinates;
    }

    private updateActivePoint(): void {
        this.activePoint = this.pointWithCoordinates(this.cursorCoordinates);
        if (this.activePoint !== null) {
            this.activePoint.isActive = true;
        }
    }

    public pointWithCoordinates(coordinates: Point): AbstractMapPoint {
        let foundPoint: AbstractMapPoint = null;

        this.points.slice().reverse().forEach((point: AbstractMapPoint) => {
            const FOUND = (foundPoint != null);
            if (point.isUnder(coordinates)) {
                if (!FOUND) {
                    foundPoint = point;
                }
            }
        });
        return foundPoint;
    }

}

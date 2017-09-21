import { Drawable } from './drawable';
import { Point } from '../point';
import { AbstractMapPoint } from './abstract-map-point';
import { NormalMapPoint } from './normal-map-point';
import { FirstMapPoint } from './first-map-point';
import { PointIndex } from '../point-index';
import { AbstractMapLine } from './abstract-map-line';
import { NormalMapLine } from './normal-map-line';
import { Map } from '../map';
import { Line } from '../line';
import { FaultyMapLine } from './faulty-map-line';

export class MapPath implements Drawable {

    private context: CanvasRenderingContext2D;
    private cursorCoordinates: Point = new Point(-100, -100);
    private currentActivePoint: PointIndex = null;
    private points: AbstractMapPoint[] = [];
    private lines: AbstractMapLine[] = [];

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
                if (!point.equals(points[0])) {
                    return new NormalMapPoint(this.context, point.x, point.y);
                }
                else {
                    return null;
                }
            }
            else { // I prefer a good ol' if-else, even though the else is not
                   // necessary.
                return new FirstMapPoint(this.context, point.x, point.y);
            }
        }).filter(value => value !== null);
    }

    private generateLinesFrom(points: Point[]): void {
        const MAP: Map = new Map();
        this.lines = [];

        if (this.points.length < 2) {
            return;
        }

        let erroneousLines: [Line, Line][] = [];
        let erroneousAngles: [Point, Point, Point][] = [];

        MAP.path.points.push.apply(MAP.path.points, points);
        erroneousLines = MAP.computeCrossingLines();

        erroneousAngles = MAP.computeBadAngles();

        this.lines = points.map((point: Point, index: number): AbstractMapLine => {
            if (index < points.length - 1) {
                return new NormalMapLine (this.context, point, points[index + 1]);
            }
        }).filter((value) => value !== undefined);

        this.lines.forEach((line: NormalMapLine, index: number) => {
            const isBadLinePredicate = (badLines: [Line, Line]) => {
                return (line.origin.equals(badLines[0].origin) &&
                       line.destination.equals(badLines[0].destination)) ||
                       (line.origin.equals(badLines[1].origin) &&
                       line.destination.equals(badLines[1].destination));
            };
            const isBadAnglePredicate = (badAngles: [Point, Point, Point]) => {
                if (this.lines.length > 1) {
                    return ((line.origin.equals(badAngles[0]) &&
                            line.destination.equals(badAngles[1])) ||
                            (line.origin.equals(badAngles[1]) &&
                            line.destination.equals(badAngles[2])));
                }
            };
            if (erroneousLines.findIndex(isBadLinePredicate) >= 0 || erroneousAngles.findIndex(isBadAnglePredicate) >= 0) {
                this.lines[index] = new FaultyMapLine(this.context, line.origin, line.destination);
            }
        });
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
        const ACTIVE_POINT = this.pointWithCoordinates(this.cursorCoordinates);
        this.currentActivePoint = this.points.lastIndexOf(ACTIVE_POINT);
        if (this.activePoint !== -1) {
            ACTIVE_POINT.isActive = true;
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

    public get activePoint(): PointIndex {
        return this.currentActivePoint;
    }

}

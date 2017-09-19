import { Path } from './path';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';
import { Point } from './point';
import { Vector } from './vector';
import { Line } from './line';

export class Map {
    public path: Path;
    public potholes: Pothole[] = [];
    public puddles: Puddle[] = [];
    public speedBoosts: SpeedBoost[] = [];

    private name: string;
    private description: string;
    private type: string;
    private rating: number;
    private plays: number;
    public height: number;
    public width: number;

    constructor(path: Path = new Path(),
                name: string = '',
                description: string = '',
                type: string = 'Amateur',
                potholes: Pothole[] = [],
                puddles: Puddle[] = [],
                speedBoosts: SpeedBoost[] = [],
                rating: number = 0,
                plays: number = 0,
                height: number = 500,
                width: number = 500) {
        this.path = path;
        this.name = name;
        this.description = description;
        this.type = type;
        this.potholes.push.apply(this.potholes, potholes);
        this.puddles.push.apply(this.puddles, puddles);
        this.speedBoosts.push.apply(this.speedBoosts, speedBoosts);
        this.rating = rating;
        this.plays = plays;
        this.height = height;
        this.width = width;
    }

    public computeLength(): number {
        const POINTS = this.path.points;
        const LENGTH = 0;
        for (let i = 0; i < this.path.points.length - 1; i++) {
            const VECTOR = Vector.fromPoints(POINTS[i], POINTS[i + 1]);
            LENGTH[1] += VECTOR.norm();
        }
        return LENGTH;
    }

    public firstStretchLength(): number {
        const POINT1 = this.path.points[0];
        const POINT2 = this.path.points[1];
        return Vector.fromPoints(POINT1, POINT2).norm();
    }

    public computeBadAngles(): [Point, Point, Point][] {
        const MIN_ANGLE = Math.PI / 4;
        const POINTS = [];
        POINTS.push.apply(POINTS, this.path.points);
        POINTS.push(POINTS[0], POINTS[1]);

        const BAD_ANGLES: [Point, Point, Point][] = [];
        for (let i = 0; i < POINTS.length - 2; i++) {
            const POINT1 = POINTS[i];
            const POINT2 = POINTS[i + 1];
            const POINT3 = POINTS[i + 2];
            const VECTOR1 = Vector.fromPoints(POINT1, POINT2);
            const VECTOR2 = Vector.fromPoints(POINT3, POINT2);
            const ANGLE = VECTOR1.angleTo(VECTOR2);
            if (Math.abs(ANGLE) < MIN_ANGLE) {
                BAD_ANGLES.push([POINT1, POINT2, POINT3]);
            }
        }
        return BAD_ANGLES;
    }

    public isClosed(): boolean {
        let finished = false;

        if (this.path.points.length >= 3) {
            finished = true;
        }

        return finished;
    }

    private isInBetween(value1: number, value2: number, valueInBetween: number): boolean {
        if (value1 > value2) {
            if (value1 > valueInBetween && value2 < valueInBetween) {
                return true;
            }
        }
        else {
            if (value1 < valueInBetween && value2 > valueInBetween) {
                return true;
            }
        }
        return false;
    }

    private checkTwoLinesCross(line1: Line, line2: Line): boolean {
        if (line1.translation.x === 0) {
            const PARAMETRIC_CONSTANT = (line1.origin.x - line2.origin.x) / line2.translation.x;
            const X = line2.origin.x + PARAMETRIC_CONSTANT * line2.translation.x;
            const Y = line2.origin.y + PARAMETRIC_CONSTANT * line2.translation.y;
            if (X === line1.origin.x && this.isInBetween(line1.origin.y, line1.origin.y + line1.translation.y, Y)) {
                return true;
            }
            return false;
        }
        if (line1.translation.y === 0) {
            const PARAMETRIC_CONSTANT = (line1.origin.y - line2.origin.y) / line2.translation.y;
            const X = line2.origin.x + PARAMETRIC_CONSTANT * line2.translation.x;
            const Y = line2.origin.y + PARAMETRIC_CONSTANT * line2.translation.y;
            if (this.isInBetween(line1.origin.x, line1.origin.x + line1.translation.x, X) && Y === line1.origin.y) {
                return true;
            }
            return false;
        }
        const DENOMINATOR = line2.translation.x / line1.translation.x - line2.translation.y / line1.translation.y;

        if (DENOMINATOR !== 0) {
            const NUMERATOR =   ((line2.origin.y - line1.origin.y) / line1.translation.y)
                              - ((line2.origin.x - line1.origin.x) / line1.translation.x);

            const PARAMETRIC_CONSTANT = NUMERATOR / DENOMINATOR;
            const X = line2.origin.x + PARAMETRIC_CONSTANT * line2.translation.x;
            const Y = line2.origin.y + PARAMETRIC_CONSTANT * line2.translation.y;
            if (   this.isInBetween(line1.origin.x, line1.origin.x + line1.translation.x, X)
                && this.isInBetween(line1.origin.y, line1.origin.y + line1.translation.y, Y)) {
                return true;
            }
        }
        return false;
    }

    public computeCrossingLines(): [Line, Line][] {
        const POINTS = this.path.points;
        const LINES_THAT_CROSS: [Line, Line][] = [];
        const LINES: Line[] = [];
        for (let i = 0; i < POINTS.length - 1; i++) {
            LINES.push(new Line(POINTS[i], POINTS[i + 1]));
        }
        LINES.push(new Line(POINTS[POINTS.length - 1], POINTS[0]));
        for (let i = 0; i < LINES.length - 1; i++) {
            for (let j = i + 1; j < LINES.length; j++) {
                if (this.checkTwoLinesCross(LINES[i], LINES[j])) {
                    LINES_THAT_CROSS.push([LINES[i], LINES[j]]);
                }
            }
        }

        return LINES_THAT_CROSS;
    }

}

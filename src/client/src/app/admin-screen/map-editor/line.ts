import { Point } from './point';
import { Vector } from './vector';
import { Interval } from './interval';

export enum IntersectionType {
    INTERSECT_NONE = 0,
    INTERSECT_POINT,
    INTERSECT_LINE
}

const MAX_SLOPE = 999999999;

export class Line {

    public origin: Point;
    public destination: Point;

    constructor(origin: Point,
        destination: Point) {
        this.origin = origin;
        this.destination = destination;
    }

    public get translation(): Vector {
        return Vector.fromPoints(this.origin, this.destination);
    }

    public get slope(): number {
        const TRANSLATION = this.translation;
        if (TRANSLATION.x !== 0) {
            return TRANSLATION.y / TRANSLATION.x;
        }
        else {
            return MAX_SLOPE;
        }
    }

    public get intercept(): number {
        return this.origin.y - this.slope * this.origin.x;
    }

    public print(...args: any[]): void {
    }

    public intersectsWith(that: Line): IntersectionType {

        const point1 = this.origin;
        const point2 = that.origin;
        const vector1 = this.translation;
        const vector2 = that.translation;
        let numerator: number;
        let denominator: number;
        let intersect = IntersectionType.INTERSECT_NONE;
        const THIS_DOMAIN_X = new Interval(this.origin.x, this.destination.x);
        const THAT_DOMAIN_X = new Interval(that.origin.x, that.destination.x);
        const THIS_DOMAIN_Y = new Interval(this.origin.y, this.destination.y);
        const THAT_DOMAIN_Y = new Interval(that.origin.y, that.destination.y);

        this.print(THIS_DOMAIN_X.toString(), 'thisdomx');

        if (vector1.x !== 0 && vector1.y !== 0) {
            this.print('1');
            denominator = vector2.x / vector1.x - vector2.y / vector1.y;
            if (denominator !== 0) {
                this.print('11');
                numerator = (point2.y - point1.y) / vector1.y - (point2.x - point1.x) / vector1.x;
            }
            else {
                this.print('12');
                intersect = (this.intercept === that.intercept) ? IntersectionType.INTERSECT_LINE : IntersectionType.INTERSECT_NONE;
            }
        }
        else if (vector1.x === 0) {
            this.print('2');
            if (vector2.x !== 0) {
                this.print('21');
                numerator = (point1.x - point2.x);
                denominator = vector2.x;
            }
            else {
                this.print('22');
                intersect = (point1.x === point2.x && !THIS_DOMAIN_Y.intersect(THAT_DOMAIN_Y).isEmpty()) ?
                            IntersectionType.INTERSECT_LINE : IntersectionType.INTERSECT_NONE;
            }
        }
        else if (vector1.y === 0) {
            this.print('3');
            if (vector2.y !== 0) {
                this.print('31');
                numerator = (point1.y - point2.y);
                denominator = vector2.y;
            }
            else {
                this.print('32');
                intersect = (point1.y === point2.y && !THIS_DOMAIN_X.intersect(THAT_DOMAIN_X).isEmpty()) ?
                            IntersectionType.INTERSECT_LINE : IntersectionType.INTERSECT_NONE;
            }
        }

        if (numerator !== undefined && denominator !== undefined) {
            const PARAMETRIC_CONSTANT = numerator / denominator;
            this.print(PARAMETRIC_CONSTANT);
            const Y = PARAMETRIC_CONSTANT * vector2.y + point2.y;
            const X = PARAMETRIC_CONSTANT * vector2.x + point2.x;
            this.print(X, 'x', Y, 'y');
            intersect = (THIS_DOMAIN_Y.contains(Y) && THAT_DOMAIN_Y.contains(Y)) &&
                        (THIS_DOMAIN_X.contains(X) && THAT_DOMAIN_X.contains(X)) ?
                        IntersectionType.INTERSECT_POINT : IntersectionType.INTERSECT_NONE;
        }
        this.print(intersect);
        return intersect;
    }

}

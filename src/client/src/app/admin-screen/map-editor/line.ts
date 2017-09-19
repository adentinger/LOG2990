import { Point } from './point';
import { Vector } from './vector';

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

    public intersectsWith(that: Line): boolean {
        if (this.translation.x === 0) {
            const PARAMETRIC_CONSTANT = (this.origin.x - that.origin.x) / that.translation.x;
            const X = that.origin.x + PARAMETRIC_CONSTANT * that.translation.x;
            const Y = that.origin.y + PARAMETRIC_CONSTANT * that.translation.y;
            if (X === this.origin.x && this.isInBetween(this.origin.y, this.origin.y + this.translation.y, Y)) {
                return true;
            }
            return false;
        }
        if (this.translation.y === 0) {
            const PARAMETRIC_CONSTANT = (this.origin.y - that.origin.y) / that.translation.y;
            const X = that.origin.x + PARAMETRIC_CONSTANT * that.translation.x;
            const Y = that.origin.y + PARAMETRIC_CONSTANT * that.translation.y;
            if (this.isInBetween(this.origin.x, this.origin.x + this.translation.x, X) && Y === this.origin.y) {
                return true;
            }
            return false;
        }
        const DENOMINATOR = that.translation.x / this.translation.x - that.translation.y / this.translation.y;

        if (DENOMINATOR !== 0) {
            const NUMERATOR =   ((that.origin.y - this.origin.y) / this.translation.y)
                              - ((that.origin.x - this.origin.x) / this.translation.x);

            const PARAMETRIC_CONSTANT = NUMERATOR / DENOMINATOR;
            const X = that.origin.x + PARAMETRIC_CONSTANT * that.translation.x;
            const Y = that.origin.y + PARAMETRIC_CONSTANT * that.translation.y;
            if (   this.isInBetween(this.origin.x, this.origin.x + this.translation.x, X)
                && this.isInBetween(this.origin.y, this.origin.y + this.translation.y, Y)) {
                return true;
            }
        }
        return false;
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

}

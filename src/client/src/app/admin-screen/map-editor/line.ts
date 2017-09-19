import { Point } from './point';
import { Vector } from './vector';
import { Interval } from './interval';

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

    public intersectsWith(that: Line): boolean {
        // Not taking line width into account:
        // this: y1(x) = a1 * x + b1;
        // that: y2(x) = a2 * x + b2;

        //    a1 * x + b1 = a2 * x + b2
        // => a1 * x - a2 * x = b2 - b1
        // => x * (a1 - a2) = b2 - b1
        //    _____________________________
        // => | x = (b2 - b1) / (a1 - a2) | (a1 ≠ a2)
        //    ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯

        const A1 = this.slope;
        const B1 = this.intercept;
        const A2 = that.slope;
        const B2 = that.intercept;

        let intersect;

        if (A1 === A2) {
            intersect = (B1 === B2);
        }
        else {
            const X = (B2 - B1) / (A1 - A2);
            const THIS_DOMAIN = new Interval(this.origin.x, this.destination.x);
            const THAT_DOMAIN = new Interval(that.origin.x, that.destination.x);
            console.log(THAT_DOMAIN.lower, THAT_DOMAIN.upper);
            intersect = (THIS_DOMAIN.contains(X) && THAT_DOMAIN.contains(X));
        }

        return intersect;
    }

}

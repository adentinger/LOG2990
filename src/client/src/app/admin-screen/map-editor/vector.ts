import { Point } from './point';

export class Vector {

    public x: number;
    public y: number;

    constructor(x: number,
                y: number) {
        this.x = x;
        this.y = y;
    }

    public static fromPoints(origin: Point, destination: Point): Vector {
        return new Vector(destination.x - origin.x, destination.y - origin.y);
    }

    public toPoint(): Point {
        return new Point(this.x, this.y);
    }

    public plus(that): Vector {
        return new Vector(this.x + that.x, this.y + that.y);
    }

    public scalar(that: Vector): number {
        return this.x * that.x + this.y * that.y;
    }

    public norm(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // In radians
    public angleTo(that: Vector): number {
        const PRODUCT_OF_NORM_VECTORS = this.norm() * that.norm();
        const ANGLE = Math.acos(this.scalar(that) / PRODUCT_OF_NORM_VECTORS);
        return ANGLE;
    }

}


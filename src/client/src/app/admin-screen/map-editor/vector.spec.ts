import { Vector } from './vector';
import { Point } from './point';

describe('Vector', () => {

    it('should be created with x and y coordinates', () => {
        const VECTOR = new Vector(5, 10);
        expect(VECTOR.x).toBe(5);
        expect(VECTOR.y).toBe(10);
    });

    it('should be created with points', () => {
        const POINT1 = new Point(1, 1);
        const POINT2 = new Point(6, 11);
        const VECTOR = Vector.fromPoints(POINT1, POINT2);
        expect(VECTOR.x).toBe(5);
        expect(VECTOR.y).toBe(10);
    });

    it('should create a point', () => {
        const X = 10.4;
        const Y = -5.2;
        const VECTOR = new Vector(X, Y);
        const POINT = VECTOR.toPoint();
        expect(POINT.x).toBeCloseTo(X);
        expect(POINT.y).toBeCloseTo(Y);
    });

    it('should compute its norm', () => {
        const VECTOR = new Vector(3, 4);
        expect(VECTOR.norm()).toBe(5);
    });

    it('should compute a scalar product', () => {
        const VECTOR1 = new Vector(1, 2);
        const VECTOR2 = new Vector(2, 3);
        expect(VECTOR1.scalar(VECTOR2)).toBe(1 * 2 + 2 * 3);
        expect(VECTOR2.scalar(VECTOR1)).toBe(1 * 2 + 2 * 3);
    });

    it('should compute an angle with a peer', () => {
        const VECTOR11 = new Vector(2 * Math.cos(Math.PI / 6), 2 * Math.sin(Math.PI / 6));
        const VECTOR12 = new Vector(2 * Math.cos(Math.PI / 4), 2 * Math.sin(Math.PI / 4));
        expect(VECTOR11.angleTo(VECTOR12)).toBeCloseTo(Math.PI * (1 / 4 - 1 / 6));
    });

});

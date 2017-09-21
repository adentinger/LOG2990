import { Line, IntersectionType } from './line';
import { Point } from './point';
import { Vector } from './vector';

function makeLine(x1: number, y1: number, x2: number, y2: number): Line {
    return new Line(new Point(x1, y1), new Point(x2, y2));
}

describe('Line', () => {

    it('should be created', () => {
        const ORIGIN = new Point(0, 0);
        const DESTINATION = new Point(0, 0);
        const LINE = new Line(ORIGIN, DESTINATION);
        expect(LINE.origin).toBe(ORIGIN);
        expect(LINE.destination).toBe(DESTINATION);
    });

    it('should compute its translation', () => {
        const TRANSLATION = makeLine(50, 50, 0, 100).translation;
        expect(TRANSLATION).toEqual(new Vector(-50, 50));
    });

    describe('slope', () => {
        it('should compute the line\'s slope', () => {
            const SLOPE = makeLine(0, 0, 1, 2).slope;
            expect(SLOPE).toBeCloseTo(2);
        });
    });

    it('should compute its intercept', () => {
        const INTERCEPT = makeLine(1, 1, 2, 0).intercept;
        expect(INTERCEPT).toBeCloseTo(2);
    });

    describe('intersectsWith', () => {

        it('should return that identical lines are intersecting', () => {
            const LINE = makeLine(0, 0, 1, 1);
            expect(LINE.intersectsWith(LINE)).toBe(IntersectionType.INTERSECT_LINE);
        });

        it('should return that crossing lines are intersecting', () => {
            const LINE1 = makeLine(1, 1, 2, 2);
            const LINE2 = makeLine(1, 2, 2, 1);
            expect(LINE1.intersectsWith(LINE2)).toBe(IntersectionType.INTERSECT_POINT);
            expect(LINE2.intersectsWith(LINE1)).toBe(IntersectionType.INTERSECT_POINT);
        });

        it('should return that non-crossing lines are not intersecting', () => {
            const LINE1 = makeLine(1, 1, 10, 1);
            const LINE2 = makeLine(1, 2, 2, 1.01);
            expect(LINE1.intersectsWith(LINE2)).toBe(IntersectionType.INTERSECT_NONE);
            expect(LINE2.intersectsWith(LINE1)).toBe(IntersectionType.INTERSECT_NONE);
        });

        it('should work with vertical and horizontal lines', () => {
            const HORIZONTAL_LINE = makeLine(1, 2, 3, 2);
            const VERTICAL_LINE_XING = makeLine(2, 1, 2, 3);
            const VERTICAL_LINE_NOT_XING = makeLine(2, 1, 2, 1.99);

            expect(HORIZONTAL_LINE.intersectsWith(VERTICAL_LINE_XING)).toBe(IntersectionType.INTERSECT_POINT);
            expect(VERTICAL_LINE_XING.intersectsWith(HORIZONTAL_LINE)).toBe(IntersectionType.INTERSECT_POINT);
            expect(HORIZONTAL_LINE.intersectsWith(VERTICAL_LINE_NOT_XING)).toBe(IntersectionType.INTERSECT_NONE);
            expect(VERTICAL_LINE_NOT_XING.intersectsWith(HORIZONTAL_LINE)).toBe(IntersectionType.INTERSECT_NONE);
            expect(HORIZONTAL_LINE.intersectsWith(VERTICAL_LINE_XING)).toBe(IntersectionType.INTERSECT_POINT);
        });

        it('should work with intersecting points', () => {
            const LINE_WITH_NO_VECTOR_1 = makeLine(1, 1, 1, 1);
            const LINE_WITH_NO_VECTOR_2 = makeLine(1, 1, 1, 1);
            const LINE_WITH_NO_VECTOR_3 = makeLine(1, 2, 1, 2);

            expect(LINE_WITH_NO_VECTOR_1.intersectsWith(LINE_WITH_NO_VECTOR_2)).toBe(IntersectionType.INTERSECT_LINE);
            expect(LINE_WITH_NO_VECTOR_1.intersectsWith(LINE_WITH_NO_VECTOR_3)).toBe(IntersectionType.INTERSECT_NONE);
        });

    });

});

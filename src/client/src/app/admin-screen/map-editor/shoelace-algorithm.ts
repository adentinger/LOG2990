import { Point } from './point';

// Algorithm described here:
// https://en.wikipedia.org/wiki/Shoelace_formula#Definition
// Algebraic area >0 when visiting points counter-clockwise,
// <0 for clockwise.

export class ShoelaceAlgorithm {

    constructor() { }

    public algebraicAreaOf(points: Point[]) {
        const NUMBER_OF_POINTS = points.length;
        let DOUBLE_AREA = 0;
        for (let i = 0; i < NUMBER_OF_POINTS; ++i) {
            const CURRENT_POINT = points[i];
            const NEXT_POINT = points[(i + 1) % NUMBER_OF_POINTS];

            const DETERMINANT = CURRENT_POINT.x * NEXT_POINT.y -
                                CURRENT_POINT.y * NEXT_POINT.x;
            DOUBLE_AREA += DETERMINANT;
        }

        return DOUBLE_AREA / 2;
    }

}

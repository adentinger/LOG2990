import { TestBed, inject } from '@angular/core/testing';
import { ShoelaceAlgorithm } from './shoelace-algorithm';
import { MockMaps } from './mock-maps';
import { Point } from './point';

describe('ShoelaceAlgorithm', () => {

    let mockMaps: MockMaps;
    let algorithm: ShoelaceAlgorithm;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ShoelaceAlgorithm,
                MockMaps
            ]
        });
    });

    beforeEach(inject([ShoelaceAlgorithm, MockMaps],
                      (shoelaceAlgorithm: ShoelaceAlgorithm,
                       mockMapFactory: MockMaps) => {
        algorithm = shoelaceAlgorithm;
        mockMaps = mockMapFactory;
    }));

    it('should compute the algebraic area of a polygon', () => {
        const CHANGE_Y_AXIS = (point: Point) => { point.y = -point.y; };

        const CLOCKWISE_POLYGON = mockMaps.clockwise().path.points;
        CLOCKWISE_POLYGON.forEach(CHANGE_Y_AXIS);
        expect(algorithm.algebraicAreaOf(CLOCKWISE_POLYGON) < 0).toBe(true);

        const COUNTER_CLOCKWISE_POLYGON = mockMaps.counterClockwise().path.points;
        COUNTER_CLOCKWISE_POLYGON.forEach(CHANGE_Y_AXIS);
        expect(algorithm.algebraicAreaOf(COUNTER_CLOCKWISE_POLYGON) > 0).toBe(true);
    });

});

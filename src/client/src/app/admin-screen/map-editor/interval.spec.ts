import { emptyMap3, functionalMap4, disfunctionalMap3, disfunctionalMap4 } from './mock-maps';
import { Map } from './map';
import { Path } from './path';
import { Point } from './point';
import { Line } from './line';
import { Interval } from './interval';

describe('Interval', () => {

    it('should be created', () => {
        const LOWER_BOUND = 0;
        const UPPER_BOUND = 10;
        const INTERVAL = new Interval(LOWER_BOUND, UPPER_BOUND);
        expect(INTERVAL.lower).toBe(LOWER_BOUND);
        expect(INTERVAL.upper).toBe(UPPER_BOUND);
    });

    it('should filter bounds correctly when creating', () => {
        const LOWER_BOUND = 100;
        const UPPER_BOUND = 1000;
        const INTERVAL = new Interval(UPPER_BOUND, LOWER_BOUND);
        expect(INTERVAL.lower).toBe(LOWER_BOUND);
        expect(INTERVAL.upper).toBe(UPPER_BOUND);
    });

    it('should verify is number is in bound', () => {
        const LOWER_BOUND = 10;
        const UPPER_BOUND = 100;
        const NUMBER_IN_BOUND = 50;
        const NUMBER_OUT_OF_BOUND = 1000;
        const INTERVAL = new Interval(UPPER_BOUND, LOWER_BOUND);
        expect(INTERVAL.contains(NUMBER_IN_BOUND)).toBe(true);
        expect(INTERVAL.contains(NUMBER_OUT_OF_BOUND)).toBe(false);
    });

    it('should verify is number is in bound', () => {
        const LOWER_BOUND = 10;
        const UPPER_BOUND = 100;
        const NUMBER_IN_BOUND = 50;
        const NUMBER_OUT_OF_BOUND = 1000;
        const INTERVAL = new Interval(UPPER_BOUND, LOWER_BOUND);
        expect(INTERVAL.contains(NUMBER_IN_BOUND)).toBe(true);
        expect(INTERVAL.contains(NUMBER_OUT_OF_BOUND)).toBe(false);
    });
});

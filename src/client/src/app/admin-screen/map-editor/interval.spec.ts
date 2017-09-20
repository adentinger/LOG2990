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

    it('should check if two intervals intersect', () => {
        const LOWER_BOUND_1 = 10;
        const UPPER_BOUND_1 = 100;
        const LOWER_BOUND_2 = 50;
        const UPPER_BOUND_2 = 150;
        const LOWER_BOUND_3 = 0;
        const UPPER_BOUND_3 = 9;
        const INTERVAL_1 = new Interval(UPPER_BOUND_1, LOWER_BOUND_1);
        const INTERVAL_2 = new Interval(UPPER_BOUND_2, LOWER_BOUND_2);
        const INTERVAL_3 = new Interval(UPPER_BOUND_3, LOWER_BOUND_3);
        const FIRST_INTERVAL = new Interval(50, 100);
        expect(INTERVAL_1.intersect(INTERVAL_2)).toEqual(FIRST_INTERVAL);
        expect(INTERVAL_1.intersect(INTERVAL_3).isEmpty()).toBe(true);
    });
});

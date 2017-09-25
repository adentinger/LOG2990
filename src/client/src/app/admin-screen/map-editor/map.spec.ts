import { emptyMap3, functionalMap4, disfunctionalMap3, disfunctionalMap4 } from './mock-maps';
import { Map, MIN_LINE_LENGTH } from './map';
import { Path } from './path';
import { Point } from './point';
import { Line } from './line';

describe('Map', () => {

    it('should be created', () => {
        expect(emptyMap3).toBeTruthy();
        expect(emptyMap3.height).toEqual(500);
        expect(emptyMap3.width).toEqual(500);
        expect(emptyMap3.path).toEqual(new Path());
        expect(emptyMap3.potholes).toEqual([]);
        expect(emptyMap3.puddles).toEqual([]);
        expect(emptyMap3.speedBoosts).toEqual([]);
    });

    it('should compute length', () => {
        expect(functionalMap4.computeLength()).toBeCloseTo(34.14);
        expect(emptyMap3.computeLength()).toEqual(0);
    });

    it('should return first stretch length', () => {
        expect(functionalMap4.firstStretchLength()).toEqual(10);
        expect(emptyMap3.firstStretchLength).toThrowError();
    });

    it('should check bad angles', () => {
        expect(functionalMap4['computeBadAngles']()).toEqual([]);
        expect(emptyMap3['computeBadAngles']()).toEqual([]);
        expect(disfunctionalMap3['computeBadAngles']()).toEqual([[new Point(0, 2), new Point(10, 2), new Point(0, 10)],
                                                                 [new Point(10, 2), new Point(0, 10), new Point(2, 1)],
                                                                 [new Point(2, 1), new Point(0, 2), new Point(10, 2)]]);
    });

    it('should check if map is closed', () => {
        expect(functionalMap4.isClosed()).toBeTruthy();
        expect(emptyMap3.isClosed()).toBe(false);
        expect(disfunctionalMap4.isClosed()).toBe(false);
    });

    it('should be able to check if lines cross', () => {
        const MAP1: Map = Object.create(disfunctionalMap3);
        const CROSSING_LINES1: [Line, Line][] = [
            [
                new Line(new Point(0, 2),  new Point(10, 2)),
                new Line(new Point(0, 10), new Point(2,  1))
            ]
        ];
        expect(MAP1['computeCrossingLines']()).toEqual(CROSSING_LINES1);

        const MAP2: Map = Object.create(functionalMap4);
        const CROSSING_LINES2: [Line, Line][] = [];
        expect(MAP2['computeCrossingLines']()).toEqual(CROSSING_LINES2);

        const MAP3: Map = Object.create(disfunctionalMap4);
        const CROSSING_LINES3: [Line, Line][] = [
            [
                new Line(new Point(0, 2),  new Point(10, 2)),
                new Line(new Point(5, 5), new Point(5,  0))
            ]
        ];
        expect(MAP3['computeCrossingLines']()).toEqual(CROSSING_LINES3);
    });

    describe('computeSmallSegments', () => {

        interface PolarData {
            length: number;
            angle: number;
        }

        class PolarPathData {
            private origin: Point;
            private data: PolarData[];

            public constructor(origin: Point, data: PolarData[]) {
                this.origin = origin;
                this.data = data;
            }

            public toPath(): Path {
                const POINTS: Point[] = [this.origin];
                this.data.forEach((data: PolarData) => {
                    const LAST_POINT = POINTS[POINTS.length - 1];
                    POINTS.push(
                        new Point(LAST_POINT.x + data.length * Math.cos(data.angle),
                                  LAST_POINT.y + data.length * Math.sin(data.angle)));
                });
                return new Path(POINTS);
            }
        }

        it('should not find small lines if there are none', () => {
            const DATA: PolarData[] = [
                {length: MIN_LINE_LENGTH * 1.01,  angle: 52.1},
                {length: MIN_LINE_LENGTH * 154.8, angle: 87.2}
            ];
            const pathData = new PolarPathData(new Point(10, 15), DATA);
            const MAP1 = new Map(pathData.toPath());
            expect(MAP1['computeSmallSegments']().length).toEqual(0);
        });

        it('should find small lines if there are', () => {
            const DATA: PolarData[] = [
                {length: 0.0, angle: 52.1},
                {length: MIN_LINE_LENGTH * 1.01, angle: 14.7},
                {length: MIN_LINE_LENGTH * 20.4, angle: 128.3},
                {length: MIN_LINE_LENGTH * 0.99, angle: 59.1},
                {length: MIN_LINE_LENGTH * 0.0,  angle: 48.6}
            ];
            const pathData = new PolarPathData(new Point(10, 15), DATA);
            const MAP1 = new Map(pathData.toPath());
            expect(MAP1['computeSmallSegments']().length).toEqual(3);
        });

    });

});

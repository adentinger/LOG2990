import { Map } from './map';
import { Path } from './path';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';
import { Point } from './point';

export class MockMaps {

    public static readonly MIN_LINE_LENGTH = 10.0;

    public emptyMap1(): Map {
        return new Map(new Path(), MockMaps.MIN_LINE_LENGTH);
    }

    public functionalMap1(): Map {
        return new Map(new Path([new Point(0, 0), new Point(10, 0), new Point(0, 10), new Point(0, 0)]),
                       MockMaps.MIN_LINE_LENGTH,
                       'name',
                       'description',
                       'professional',
                       [new Pothole(11), new Pothole(17), new Pothole(22)],
                       [new Puddle(15)],
                       [new SpeedBoost(1), new SpeedBoost(6), new SpeedBoost(6), new SpeedBoost(23), new SpeedBoost(27)],
                       4,
                       12);
    }

    public functionalMap2(): Map {
        return new Map(new Path([new Point(0, 0), new Point(10, 0), new Point(0, 10), new Point(0, 0)]),
                       MockMaps.MIN_LINE_LENGTH,
                       'name',
                       'description',
                       'professional',
                       [],
                       [],
                       [],
                       4,
                       12);
    }

    public disfunctionalMap1(): Map {
        return new Map(new Path([new Point(0, 2), new Point(10, 2), new Point(0, 10), new Point(2, 1), new Point(0, 2)]),
                       MockMaps.MIN_LINE_LENGTH,
                       'name',
                       'description',
                       'sdljhgso',
                       [],
                       [],
                       [],
                       9,
                       -1);
    }

    public disfunctionalMap2(): Map {
        return new Map(new Path([new Point(0, 2), new Point(10, 2), new Point(5, 5), new Point(5, 0), new Point(0, 0)]),
                       MockMaps.MIN_LINE_LENGTH,
                       'name',
                       'description',
                       'sdljhgso',
                       [],
                       [],
                       [],
                       9,
                       -1);
    }

}

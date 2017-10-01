import { SerializedMap } from './serialized-map';
import { Point } from './point';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';

export class MockSerializedMaps {

    public empty1(): SerializedMap {
        return new SerializedMap('', '', '', 0, 0, 0, [], [], [], []);
    }

    public functional1(): SerializedMap {
        return new SerializedMap(
            'functional1',
            'desc. functional1',
            'Amateur',
            145,
            35,
            1000,
            [new Point(0, 0), new Point(10, 5), new Point(0, 10), new Point(0, 0)],
            [new Pothole(10), new Pothole(20), new Pothole(50)],
            [new Puddle(15), new Puddle(25), new Puddle(55)],
            [new SpeedBoost(5), new SpeedBoost(15), new SpeedBoost(45)]
        );
    }

    public functional2(): SerializedMap {
        return new SerializedMap(
            'functional2',
            '',
            'Amateur',
            0,
            0,
            0,
            [new Point(0, 0), new Point(10, 5), new Point(0, 10), new Point(0, 0)],
            [],
            [],
            []
        );
    }

    public disfunctional1(): SerializedMap {
        return new SerializedMap(
            'disfunctional1',
            'desc. disfunctional1',
            'Amateur',
            145,
            35,
            1000,
            [new Point(0, 0), new Point(0, 0)],
            [new Pothole(10), new Pothole(20), new Pothole(50)],
            [new Puddle(15), new Puddle(25), new Puddle(55)],
            [new SpeedBoost(5), new SpeedBoost(15), new SpeedBoost(45)]
        );
    }

    public disfunctional2(): SerializedMap {
        return new SerializedMap(
            'functional1',
            'desc. functional1',
            'Amateur',
            145,
            35,
            1000,
            [new Point(0, 0), new Point(10, 5), new Point(5, 10), new Point(10, 5), new Point(0, 0)],
            [new Pothole(10), new Pothole(20), new Pothole(50)],
            [new Puddle(15), new Puddle(25), new Puddle(55)],
            [new SpeedBoost(5), new SpeedBoost(15), new SpeedBoost(45)]
        );
    }

}

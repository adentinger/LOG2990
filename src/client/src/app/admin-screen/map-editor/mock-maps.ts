import { Map } from './map';
import { Path } from './path';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';
import { Point } from './point';

export let emptyMap: Map = new Map();

export let emptyMap2: Map = new Map();

export let emptyMap3: Map = new Map();

export let functionalMap1: Map = new Map(
    new Path([new Point(0, 0), new Point(10, 0), new Point(0, 10), new Point(0, 0)]),
    'name',
    'description',
    'professional',
    [new Pothole(11), new Pothole(17), new Pothole(22)],
    [new Puddle(15)],
    [new SpeedBoost(1), new SpeedBoost(6), new SpeedBoost(6), new SpeedBoost(23), new SpeedBoost(27)],
    [12, 24, 48],
    4,
    12
);

export let functionalMap2: Map = new Map(
    new Path([new Point(0, 0), new Point(10, 0), new Point(0, 10), new Point(0, 0)]),
    'name',
    'description',
    'professional',
    [],
    [],
    [],
    [],
    4,
    12
);

export let functionalMap3: Map = new Map(
    new Path([new Point(0, 0), new Point(10, 0), new Point(0, 10), new Point(0, 0)]),
    'name',
    'description',
    'professional',
    [],
    [],
    [],
    [],
    4,
    12
);

export let functionalMap4: Map = new Map(
    new Path([new Point(0, 0), new Point(10, 0), new Point(0, 10), new Point(0, 0)]),
    'name',
    'description',
    'professional',
    [new Pothole(11), new Pothole(17), new Pothole(22)],
    [new Puddle(15)],
    [new SpeedBoost(1), new SpeedBoost(6), new SpeedBoost(6), new SpeedBoost(23), new SpeedBoost(27)],
    [12, 24, 48],
    4,
    12
);

export let disfunctionalMap: Map = new Map (
    new Path([new Point(0, 2), new Point(10, 2), new Point(0, 10), new Point(2, 1), new Point(0, 2)]),
    'name',
    'description',
    'sdljhgso',
    [],
    [],
    [],
    [],
    9,
    -1,
    -2,
    -2
);

export let disfunctionalMap2: Map = new Map (
    new Path([new Point(0, 2), new Point(10, 2), new Point(5, 5), new Point(5, 0), new Point(0, 0)]),
    'name',
    'description',
    'sdljhgso',
    [],
    [],
    [],
    [],
    9,
    -1,
    -2,
    -2
);

export let disfunctionalMap3: Map = new Map (
    new Path([new Point(0, 2), new Point(10, 2), new Point(0, 10), new Point(2, 1), new Point(0, 2)]),
    'name',
    'description',
    'sdljhgso',
    [],
    [],
    [],
    [],
    9,
    -1,
    -2,
    -2
);

export let disfunctionalMap4: Map = new Map (
    new Path([new Point(0, 2), new Point(10, 2), new Point(5, 5), new Point(5, 0), new Point(0, 0)]),
    'name',
    'description',
    'sdljhgso',
    [],
    [],
    [],
    [],
    9,
    -1,
    -2,
    -2
);

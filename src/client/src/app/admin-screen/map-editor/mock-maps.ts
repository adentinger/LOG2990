import { Map } from './map';
import { Path } from './path';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';

export let emptyMap: Map = new Map();

export let functionalMap1: Map = new Map(
    new Path([{'x': 0, 'y': 0}, {'x': 10, 'y': 0}, {'x': 0, 'y': 10}]),
    'name',
    'description',
    'professional',
    [new Pothole(11), new Pothole(17), new Pothole(22)],
    [new Puddle(15)],
    [new SpeedBoost(1), new SpeedBoost(6), new SpeedBoost(6), new SpeedBoost(23), new SpeedBoost(27)],
    4,
    12
);

export let functionalMap2: Map = new Map(
    new Path([{'x': 0, 'y': 0}, {'x': 10, 'y': 0}, {'x': 0, 'y': 10}]),
    'name',
    'description',
    'professional',
    [],
    [],
    [],
    4,
    12
);

export let disfunctionalMap: Map = new Map (
    new Path([{'x': 0, 'y': 2}, {'x': 10, 'y': 2}, {'x': 0, 'y': 10}, {'x': 2, 'y': 1}]),
    'name',
    'description',
    'sdljhgso',
    [],
    [],
    [],
    9,
    -1,
    -2,
    -2
);

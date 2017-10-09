import { Map } from '../../admin-screen/map-editor/map';
import { Path } from '../../admin-screen/map-editor/path';
import { Point } from '../../admin-screen/map-editor/point';

const MIN_LINE_LENGTH = 10.0;

export const MAP0 = new Map(new Path([
    new Point( 0,  0),
    new Point(10,  0),
    new Point(10, 10),
    new Point( 0,  0)]), MIN_LINE_LENGTH, 'map0', 'description0', 'Amateur', [], [], [], [ 1, 2, 3], 0, 0, 0);

export const MAP1 = new Map(new Path([
    new Point(  0,   0),
    new Point(100,   0),
    new Point(100, 100),
    new Point(  0,   0)]), MIN_LINE_LENGTH, 'map1', 'description1', 'Amateur', [], [], [], [4, 5, 6], 10, 100, 100);

export const MAP2 = new Map(new Path([
    new Point(  0,   0),
    new Point(200,   0),
    new Point(200, 200),
    new Point(  0,   0)]), MIN_LINE_LENGTH, 'map2', 'description2', 'Amateur', [], [], [], [7, 8, 9], 20, 200, 200);

export const MAP3 = new Map(new Path([
    new Point(  0,   0),
    new Point(300,   0),
    new Point(300, 300),
    new Point(  0,   0)]), MIN_LINE_LENGTH, 'map3', 'description3', 'Amateur', [], [], [], [10, 11, 12], 30, 300, 300);

export const MAP4 = new Map(new Path([
        new Point( 0,  0),
        new Point(10,  0),
        new Point(10, 10),
        new Point( 0,  0)]), MIN_LINE_LENGTH, 'map0', 'description0', 'Amateur', [], [], [], [ 1, 2, 3], 0,  10, 10);

export const MAP5 = new Map(new Path([
        new Point(  0,   0),
        new Point(100,   0),
        new Point(100, 100),
        new Point(  0,   0)]), MIN_LINE_LENGTH, 'map1', 'description1', 'Amateur', [], [], [], [4, 5, 6], 10, 100, 100);

export const MAP6 = new Map(new Path([
        new Point(  0,   0),
        new Point(200,   0),
        new Point(200, 200),
        new Point(  0,   0)]), MIN_LINE_LENGTH, 'map2', 'description2', 'Amateur', [], [], [], [7, 8, 9], 20, 200, 200);

export const MAP7 = new Map(new Path([
        new Point(  0,   0),
        new Point(300,   0),
        new Point(300, 300),
        new Point(  0,   0)]), MIN_LINE_LENGTH, 'map3', 'description3', 'Amateur', [], [], [], [10, 11, 12], 30, 300, 300);

export const MAPS: Map[] = [MAP0, MAP1, MAP2, MAP3, MAP4, MAP5, MAP6, MAP7, MAP0, MAP1, MAP2, MAP3, MAP4, MAP5, MAP6, MAP7,
                            MAP0, MAP1, MAP2, MAP3, MAP4, MAP5, MAP6, MAP7, MAP0, MAP1, MAP2, MAP3, MAP4, MAP5, MAP6, MAP7];

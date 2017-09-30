import { Map } from '../../admin-screen/map-editor/map';
import { Path } from '../../admin-screen/map-editor/path';
import { Point } from '../../admin-screen/map-editor/point';

export const MAP0 = new Map(new Path([
    new Point( 0,  0),
    new Point(10,  0),
    new Point(10, 10),
    new Point( 0,  0)]), 'map0', 'description0', 'Amateur', [], [], [], 0, 0, 0);

export const MAP1 = new Map(new Path([
    new Point(  0,   0),
    new Point(100,   0),
    new Point(100, 100),
    new Point(  0,   0)]), 'map1', 'description1', 'Amateur', [], [], [], 10, 100, 100);

export const MAP2 = new Map(new Path([
    new Point(  0,   0),
    new Point(200,   0),
    new Point(200, 200),
    new Point(  0,   0)]), 'map2', 'description2', 'Amateur', [], [], [], 20, 200, 200);

export const MAPS = [MAP0, MAP1, MAP2];

export const NEW_MAP3 = new Map(new Path([
    new Point(  0,   0),
    new Point(300,   0),
    new Point(300, 300),
    new Point(  0,   0)]), 'map3', 'description3', 'Amateur', [], [], [], 30, 300, 300);

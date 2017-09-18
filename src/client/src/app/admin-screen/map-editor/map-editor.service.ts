import { Injectable } from '@angular/core';
import { Map } from './map';
import { Point } from './point';
import { Item } from './item';

@Injectable()
export class MapEditorService {

    private currentMap: Map;

    constructor() { }

    public newMap(): boolean {
        let mapCreated = false;

        this.deleteMap();

        this.currentMap = new Map();
        if (this.currentMap !== null) {
            mapCreated = true;
        }

        return mapCreated;
    }

    public saveMap(): Promise<boolean> {
        return Promise.reject(false);
    }

    public deleteMap(): void {
    }

    public get points(): Point[] {
        return this.currentMap.path.points;
    }

    private calculateAngle(vector1: {x: number, y: number}, vector2: {x: number, y: number}): number {
        const scalarProduct = (vector1.x * vector2.x + vector1.y * vector2.y);
        const productOfNormOfVectors = (Math.sqrt((vector1.x * vector1.x + vector1.y * vector1.y))) *
                                       (Math.sqrt((vector2.x * vector2.x + vector2.y * vector2.y)));
        const angle = Math.acos(scalarProduct / productOfNormOfVectors);
        return angle;
    }

    public checkAngles(): Array<[Point, Point, Point]> {
        const MIN_ANGLE = Math.PI / 4;
        const points = [];
        points.push.apply(points, this.currentMap.path.points);
        points.push(points[0], points[1]);
        const badAngles: Array<[Point, Point, Point]> = [];
        for (let i = 0; i < points.length - 2; i++) {
            const point1 = points[i];
            const point2 = points[i + 1];
            const point3 = points[i + 2];
            const vector1 = {x: (point2.x - point1.x), y: (point2.y - point1.y)};
            const vector2 = {x: (point2.x - point3.x), y: (point2.y - point3.y)};
            const angle = this.calculateAngle (vector1, vector2);
            if (Math.abs(angle) < MIN_ANGLE) {
                badAngles.push([point1, point2, point3]);
            }
        }
        return badAngles;
    }

    public checkPathLoopBack(): boolean {
        let finished = false;

        if (this.currentMap.path.points.length >= 3) {
            finished = true;
        }

        return finished;
    }

    public checkLinesCross(): Array<[[Point, Point], [Point, Point]]> {
        return null;
    }

    public pushPoint(point: Point): void {
    }

    public popPoint(): Point {
        return null;
    }

    public editPoint(): void {
    }

    public addItem(item: Item): boolean {
        return false;
    }
}

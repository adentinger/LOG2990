import { Injectable } from '@angular/core';
import { Map } from './map';
import { Point } from './point';
import { Item } from './item';
import { Vector } from './vector';
import { Line } from './line';
import { Path } from './path';

@Injectable()
export class MapEditorService {

    private currentMap: Map;

    constructor() {
        this.newMap();
    }

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
        this.currentMap = null;
    }

    public get points(): Point[] {
        return this.currentMap.path.points;
    }

    public get path(): Path {
        return this.currentMap.path;
    }

    public pushPoint(point: Point): void {
        if (point.x < this.currentMap.width && point.y < this.currentMap.height && point.x > 0 && point.y > 0) {
            this.currentMap.path.points.push(point);
        }
    }

    public popPoint(): Point {
        return this.currentMap.path.points.pop();
    }

    public editPoint(index: number, x: number, y: number): void {
        if (x < this.currentMap.width && y < this.currentMap.height && x > 0 && y > 0) {
            this.currentMap.path.points[index].x = x;
            this.currentMap.path.points[index].y = y;
        }
    }

    private findMapLength(): [number, number] {
        const POINTS = this.currentMap.path.points;
        let vector = Vector.fromPoints(POINTS[0], POINTS[0 + 1]);
        const FIRST_STRETCH = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

        const LENGTH: [number, number] = [0, 0];
        LENGTH[0] += FIRST_STRETCH;
        for (let i = 0; i < this.currentMap.path.points.length - 1; i++) {
            vector = Vector.fromPoints(POINTS[i], POINTS[i + 1]);
            LENGTH[1] += Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        }
        return LENGTH;
    }

    public addItem(item: Item): void {
        const MAP_LENGTH = this.findMapLength();
        if (item.type === 'puddle' && MAP_LENGTH[0] < item.position && item.position < MAP_LENGTH[1]) {
            this.currentMap.puddles.push(item);
        }
        else if (item.type === 'pothole' && MAP_LENGTH[0] < item.position && item.position < MAP_LENGTH[1]) {
            this.currentMap.potholes.push(item);
        }
        else if (item.type === 'speedBoost' && item.position < MAP_LENGTH[1]) {
            this.currentMap.speedBoosts.push(item);
        }
    }
}

import { Injectable } from '@angular/core';
import { Map } from './map';
import { Point } from './point';
import { Item } from './item';
import { Path } from './path';
import { Puddle } from './puddle';

@Injectable()
export class MapEditorService {

    private map: Map;

    constructor() {
        this.newMap();
    }

    public newMap(): boolean {
        let mapCreated = false;

        this.deleteMap();

        this.map = new Map();
        if (this.map !== null) {
            mapCreated = true;
        }

        return mapCreated;
    }

    public saveMap(): Promise<boolean> {
        return Promise.reject(false);
    }

    public deleteMap(): void {
        this.map = null;
    }

    public get points(): Point[] {
        return this.map.path.points;
    }

    public get path(): Path {
        return this.map.path;
    }

    public pushPoint(point: Point): void {
        if (this.map.isClosed()) {
            return;
        }
        if (point.x < this.map.width && point.y < this.map.height && point.x > 0 && point.y > 0) {
            this.map.path.points.push(point);
        }
    }

    public popPoint(): Point {
        return this.map.path.points.pop();
    }

    public editPoint(index: number, point: Point): void {
        if (point.x < this.map.width && point.y < this.map.height &&
            point.x > 0 && point.y > 0) {
            this.map.path.points[index].x = point.x;
            this.map.path.points[index].y = point.y;
        }
    }

    private addItem(item: Item): void {
        const FIRST_STRETCH_LENGTH = this.map.firstStretchLength();
        const MAP_LENGTH = this.map.computeLength();
        if (item.type === 'puddle' && FIRST_STRETCH_LENGTH < item.position && item.position < MAP_LENGTH) {
            this.map.puddles.push(item);
        }
        else if (item.type === 'pothole' && FIRST_STRETCH_LENGTH < item.position && item.position < MAP_LENGTH) {
            this.map.potholes.push(item);
        }
        else if (item.type === 'speedBoost' && item.position < MAP_LENGTH) {
            this.map.speedBoosts.push(item);
        }
    }

    public LinterHusher(): void {
        this.addItem(new Puddle(0));
        throw new Error('Please do not use me again or I will call Chuck ' +
                        'Norris.');
    }

    public isFirstPoint(point: Point): boolean {
        return point.equals(this.map.path.points[0]);
    }

}

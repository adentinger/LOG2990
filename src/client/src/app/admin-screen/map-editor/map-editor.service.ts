import { Injectable } from '@angular/core';
import { Map } from './map';
import { Point } from './point';
import { Path } from './path';
import { PointIndex } from './point-index';

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
        if (this.areValidCoordinates(point)) {
            this.map.path.points.push(point);
        }
    }

    public popPoint(): Point {
        return this.map.path.points.pop();
    }

    public editPoint(index: PointIndex, coordinates: Point): void {
        if (this.areValidCoordinates(coordinates)) {
            const POINT = this.points[index];
            POINT.x = coordinates.x;
            POINT.y = coordinates.y;
        }
    }

    private areValidCoordinates(coordinates: Point): boolean {
        return coordinates.x < this.map.width && coordinates.y < this.map.height &&
               coordinates.x > 0              && coordinates.y > 0;
    }

}

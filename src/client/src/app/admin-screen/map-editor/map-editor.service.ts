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
        if (this.areValidCoordinates(point)) {
            this.map.path.points.push(point);
        }
    }

    public popPoint(): Point {
        return this.map.path.points.pop();
    }

    public editPoint(oldCoordinates: Point, newCoordinates: Point): void {
        if (this.areValidCoordinates(newCoordinates)) {
            const MATCHES = this.points.filter(oldCoordinates.equals);
            if (MATCHES.length > 0) {
                MATCHES[0].x = newCoordinates.x;
                MATCHES[0].y = newCoordinates.y;
            }
            else {
                const ERROR_MESSAGE = 'Point (' + oldCoordinates.x + ', ' +
                                      oldCoordinates.y + ') cannot be modified ' +
                                      'because it does not exist';
                throw new Error(ERROR_MESSAGE);
            }
        }
    }

    private areValidCoordinates(coordinates: Point): boolean {
        return coordinates.x < this.map.width && coordinates.y < this.map.height &&
               coordinates.x > 0              && coordinates.y > 0;
    }

}

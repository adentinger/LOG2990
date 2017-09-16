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

    public checkAngles(): boolean {
        return false;
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

    public popPoint(): void {
    }

    public editPoint(): void {
    }

    public addItem(item: Item): boolean {
        return false;
    }
}

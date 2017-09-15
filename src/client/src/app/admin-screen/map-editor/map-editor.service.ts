import { Injectable, Inject } from '@angular/core';

import { Map } from './map';
import { Point } from './point';
import { Path } from './path';

@Injectable()
export class MapEditorService {

    private currentMap: Map;
    constructor() { }

    public newMap(): boolean {
        return false;
    }

    public saveMap(): Promise<boolean> {
        return Promise.reject(false);
    }

    public checkAngles(): boolean {
        return false;
    }

    public checkPathFinished(): boolean {
        return false;
    }

    public checkLinesCross(): Array<[[Point, Point], [Point, Point]]> {
        return null;
    }

    public pushPoint(point: Point): void {
    }

    public popPoint(): void {
    }
}

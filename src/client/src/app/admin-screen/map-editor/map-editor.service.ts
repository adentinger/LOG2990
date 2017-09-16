import { Injectable } from '@angular/core';

import { Point } from './point';

@Injectable()
export class MapEditorService {

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

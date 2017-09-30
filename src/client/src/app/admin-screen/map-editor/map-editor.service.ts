import { Injectable } from '@angular/core';

import { AbstractRacingUnitConversionService } from './abstract-racing-unit-conversion.service';
import { Map } from './map';
import { SerializedMap } from './serialized-map';
import { Point } from './point';
import { Path } from './path';
import { PointIndex } from './point-index';

@Injectable()
export class MapEditorService {

    private map: Map;

    constructor(private converter: AbstractRacingUnitConversionService) {
        this.newMap();
    }

    public get currentMap(): Map {
        return this.map;
    }

    public newMap(): void {
        this.map = new Map();
    }

    public serializeMap(): void {

    }

    public deserializeMap(): SerializedMap {
        return null;
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
        if (this.areValidCoordinates(point)) {
            this.map.path.points.push(point);
        }
    }

    public popPoint(): Point {
        return this.map.path.points.pop();
    }

    public editPoint(index: PointIndex, coordinates: Point): void {
        if (this.areValidCoordinates(coordinates)) {
            const POINTS_TO_EDIT = [];
            const EDITING_FIRST_POINT = (index === 0);
            const IS_PATH_CLOSED =
                (this.points[0].equals(this.points[this.points.length - 1]));

            if (EDITING_FIRST_POINT && IS_PATH_CLOSED) {
                POINTS_TO_EDIT.push(this.points[0],
                                    this.points[this.points.length - 1]);
            }
            else {
                POINTS_TO_EDIT.push(this.points[index]);
            }

            POINTS_TO_EDIT.forEach((point: Point) => {
                point.x = coordinates.x;
                point.y = coordinates.y;
            });
        }
    }

    private areValidCoordinates(coordinates: Point): boolean {
        return coordinates.x < this.map.width && coordinates.y < this.map.height &&
               coordinates.x > 0              && coordinates.y > 0;
    }

    public isFirstPoint(pointIndex: PointIndex): boolean {
        return pointIndex === 0;
    }

    public get firstPoint(): Point {
        if (this.points.length > 0) {
            return this.points[0];
        }
        else {
            throw new Error('Cannot get first map point: map is empty.');
        }
    }

    public isMapValid(): boolean {
        return this.map.isValid();
    }

}

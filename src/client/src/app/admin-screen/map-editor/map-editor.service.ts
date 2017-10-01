import { Injectable } from '@angular/core';

import { AbstractRacingUnitConversionService } from './abstract-racing-unit-conversion.service';
import { Map } from './map';
import { SerializedMap } from './serialized-map';
import { Point } from './point';
import { Path } from './path';
import { PointIndex } from './point-index';

@Injectable()
export class MapEditorService {

    public mapWidth = 0;
    public mapHeight = 0;

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

    public serializeMap(): SerializedMap {
        if (this.areWidthAndHeightSet()) {
            if (this.map.isValid()) {
                const POINTS: Point[] =
                    this.map.path.points.map((point: Point) => {
                        const X = this.converter.lengthToGameUnits(point.x);
                        const Y = this.converter.lengthToGameUnits(point.y);
                        return new Point(X, Y);
                    });
                return new SerializedMap(
                    this.map.name,
                    this.map.description,
                    this.map.type,
                    this.map.sumRatings,      // Reset rating?
                    this.map.numberOfRatings, // Reset rating?
                    0,                        // Reset number of plays?
                    POINTS,
                    this.map.potholes.slice(),
                    this.map.puddles.slice(),
                    this.map.speedBoosts.slice()
                );
            }
            else {
                throw new Error('Serialization failed: ' +
                                'The map is currently not valid. ' +
                                'Fix map problems before attempting serialization');
            }
        }
        else {
            throw new Error('Serializing map failed: ' +
                            'Please set map width and height to a value ' +
                            'that is >0 before attempting to deserialize.');
        }
    }

    public deserializeMap(serializedMap: SerializedMap): void {
        if (this.areWidthAndHeightSet()) {
            const POINTS: Point[] = serializedMap.points.map((point: Point) => {
                const X = this.converter.lengthFromGameUnits(point.x);
                const Y = this.converter.lengthFromGameUnits(point.y);
                return new Point(X, Y);
            });
            const NEW_MAP = new Map(
                new Path(POINTS),
                serializedMap.name,
                serializedMap.description,
                serializedMap.type,
                serializedMap.potholes.slice(),
                serializedMap.puddles.slice(),
                serializedMap.speedBoosts.slice(),
                serializedMap.sumRatings,
                serializedMap.numberOfRatings,
                serializedMap.numberOfPlays
            );

            if (NEW_MAP.isValid()) {
                this.map = NEW_MAP;
            }
            else {
                throw new Error('Deserializing map failed: ' +
                                'The serialized map is not valid.');
            }
        }
        else {
            throw new Error('Deserializing map failed: ' +
                            'Please set map width and height to a value ' +
                            'that is >0 before attempting to deserialize.');
        }
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
        return coordinates.x < this.mapWidth && coordinates.y < this.mapHeight &&
               coordinates.x > 0             && coordinates.y > 0;
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

    private areWidthAndHeightSet(): boolean {
        return this.mapWidth > 0 && this.mapHeight > 0;
    }

}

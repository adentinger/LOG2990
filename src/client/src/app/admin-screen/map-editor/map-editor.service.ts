import { Injectable } from '@angular/core';

import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Map, MapError } from './map';
import { SerializedMap } from '../../common/racing/serialized-map';
import { Point } from '../../common/math/point';
import { Path } from './path';
import { PointIndex } from './point-index';
import { Track } from '../../racing/track';
import { SerializedPothole } from '../../common/racing/serialized-pothole';
import { Pothole } from './pothole';
import { SerializedSpeedBoost } from '../../common/racing/serialized-speed-boost';
import { SerializedPuddle } from '../../common/racing/serialized-puddle';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';

@Injectable()
export class MapEditorService {

    private width = 0;
    private height = 0;

    private map: Map;

    constructor(private converter: RacingUnitConversionService) {
        this.newMap();
    }

    public get currentMap(): Map {
        return this.map;
    }

    public get mapWidth(): number {
        return this.width;
    }

    public set mapWidth(mapWidth: number) {
        const ASPECT_RATIO = Track.WIDTH_MAX / Track.HEIGHT_MAX;
        this.width = mapWidth;
        this.height = mapWidth / ASPECT_RATIO;
        this.converter.windowWidth = this.width;
        this.converter.windowHeight = this.height;
        this.map.minimumSegmentLength = this.minimumDistanceBetweenPoints;
    }

    public get mapHeight(): number {
        return this.height;
    }

    public set mapHeight(mapHeight: number) {
        const ASPECT_RATIO = Track.WIDTH_MAX / Track.HEIGHT_MAX;
        this.width = ASPECT_RATIO * mapHeight;
        this.height = mapHeight;
        this.converter.windowWidth = this.width;
        this.converter.windowHeight = this.height;
        this.map.minimumSegmentLength = this.minimumDistanceBetweenPoints;
    }

    public newMap(): void {
        this.map = new Map();
        this.map.minimumSegmentLength = this.minimumDistanceBetweenPoints;
    }

    public get minimumDistanceBetweenPoints(): number {
        return this.converter.lengthFromGameUnits(2 * Track.SEGMENT_WIDTH);
    }

    public get isMapClockwise(): boolean {
        return this.map.isClockwise() ||
               this.map.computeErrors() !== MapError.NONE;
    }

    public serializeMap(): SerializedMap {
        if (this.areWidthAndHeightSet()) {
            if (this.computeMapErrors() === MapError.NONE) {
                const POINTS: Point[] =
                    this.map.path.points.map((point: Point) => {
                        const X = this.converter.lengthToGameUnits(point.x);
                        const Y = this.converter.lengthToGameUnits(point.y);
                        return new Point(X, Y);
                    });

                if (!this.map.isClockwise()) {
                    POINTS.reverse();
                }

                POINTS.pop(); // Do not include the last point ;
                              // it is the same as the first point.
                const SERIALIZED_POTHOLES: SerializedPothole[] =
                    this.map.potholes.map(
                        (pothole: Pothole) =>
                            new SerializedPothole(
                                this.converter.lengthToGameUnits(pothole.position)));
                const SERIALIZED_PUDDLES: SerializedPuddle[] =
                    this.map.potholes.map(
                        (puddle: Puddle) =>
                            new SerializedPuddle(
                                this.converter.lengthToGameUnits(puddle.position)));
                const SERIALIZED_SPEED_BOOSTS: SerializedSpeedBoost[] =
                    this.map.potholes.map(
                        (speedBoost: SpeedBoost) =>
                            new SerializedSpeedBoost(
                                this.converter.lengthToGameUnits(speedBoost.position)));

                return new SerializedMap(
                    this.map.name,
                    this.map.description,
                    this.map.type,
                    0,
                    0,
                    0,
                    POINTS,
                    SERIALIZED_POTHOLES,
                    SERIALIZED_PUDDLES,
                    SERIALIZED_SPEED_BOOSTS
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

            // A Map's last point is supposed to be the same as its first
            // point when it is valid.
            POINTS.push(new Point(POINTS[0].x, POINTS[0].y));


            const DESERIALIZED_POTHOLES: Pothole[] =
                serializedMap.potholes.map(
                (pothole: SerializedPothole) =>
                    new Pothole(
                        this.converter.lengthFromGameUnits(pothole.position)));
            const DESERIALIZED_PUDDLES: Puddle[] =
                serializedMap.puddles.map(
                    (puddle: SerializedPuddle) =>
                        new Puddle(
                            this.converter.lengthFromGameUnits(puddle.position)));
            const DESERIALIZED_SPEED_BOOSTS: SpeedBoost[] =
                serializedMap.speedBoosts.map(
                    (speedBoost: SerializedSpeedBoost) =>
                        new SpeedBoost(
                            this.converter.lengthFromGameUnits(speedBoost.position)));

            const NEW_MAP = new Map(
                new Path(POINTS),
                this.minimumDistanceBetweenPoints,
                serializedMap.name,
                serializedMap.description,
                serializedMap.type,
                DESERIALIZED_POTHOLES,
                DESERIALIZED_PUDDLES,
                DESERIALIZED_SPEED_BOOSTS,
                [],
                0,
                0,
                0
            );

            if (NEW_MAP.computeErrors() === MapError.NONE) {
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

    public computeMapErrors(): MapError {
        return this.map.computeErrors();
    }

    private areWidthAndHeightSet(): boolean {
        return this.mapWidth > 0 && this.mapHeight > 0;
    }

}

import { Injectable } from '@angular/core';
import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Map, MapError } from './map';
import { SerializedMap } from '../../common/racing/serialized-map';
import { Point } from '../../common/math/point';
import { SerializedPothole } from '../../common/racing/serialized-pothole';
import { Pothole } from './pothole';
import { SerializedPuddle } from '../../common/racing/serialized-puddle';
import { Puddle } from './puddle';
import { SerializedSpeedBoost } from '../../common/racing/serialized-speed-boost';
import { SpeedBoost } from './speed-boost';
import { Path } from './path';
import { Track } from '../../racing/track';
import { Item } from './item';
import { SerializedItem } from '../../common/racing/serialized-item';

@Injectable()
export class MapConverterService {

    constructor(private converter: RacingUnitConversionService) { }

    public serialize(map: Map): SerializedMap {
        if (map.computeErrors() === MapError.NONE) {
            const SERIALIZED_MAP =
                new SerializedMap(map.name,
                                  map.description,
                                  map.type,
                                  0,
                                  0,
                                  0);
            this.serializePoints(map, SERIALIZED_MAP);
            this.serializeItems(map, SERIALIZED_MAP);

            SERIALIZED_MAP.bestTimes = [];
            return SERIALIZED_MAP;
        }
        else {
            throw new Error('Serialization failed: ' +
                            'The map is currently not valid. ' +
                            'Fix map problems before attempting serialization');
        }
    }

    private serializePoints(map: Map, serializedMap: SerializedMap): void {
        const POINTS: Point[] =
        map.path.points.map((point: Point) => {
            const X = this.converter.lengthToGameUnits(point.x);
            const Y = this.converter.lengthToGameUnits(point.y);
            return new Point(X, Y);
        });

        if (!map.isClockwise()) {
            POINTS.reverse();
        }
        POINTS.pop(); // Do not include the last point ;
                      // it is the same as the first point.

        serializedMap.points = POINTS;
    }

    private serializeItems(map: Map, serializedMap: SerializedMap): void {
        serializedMap.potholes =
            map.potholes.map(
                (pothole: Pothole) =>
                    new SerializedPothole(
                        this.converter.lengthToGameUnits(pothole.position)));
        serializedMap.puddles =
            map.potholes.map(
                (puddle: Puddle) =>
                    new SerializedPuddle(
                        this.converter.lengthToGameUnits(puddle.position)));
        serializedMap.speedBoosts =
            map.potholes.map(
                (speedBoost: SpeedBoost) =>
                    new SerializedSpeedBoost(
                        this.converter.lengthToGameUnits(speedBoost.position)));
    }

    public deserialize(serializedMap: SerializedMap): Map {
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

        const MAP = new Map(
            new Path(POINTS),
            this.minimumDistanceBetweenPoints,
            serializedMap.name,
            serializedMap.description,
            serializedMap.type,
            DESERIALIZED_POTHOLES,
            DESERIALIZED_PUDDLES,
            DESERIALIZED_SPEED_BOOSTS
        );

        if (MAP.computeErrors() === MapError.NONE) {
            return MAP;
        }
        else {
            throw new Error('Deserializing map failed: ' +
                            'The serialized map is not valid.');
        }
    }

    private deserializePoints(serializedMap: SerializedMap, map: Map): void {
        return null;
    }

    private deserializeItems(serializedMap: SerializedMap, map: Map): void {
        return null;
    }

    private get minimumDistanceBetweenPoints(): number {
        return this.converter.lengthFromGameUnits(2 * Track.SEGMENT_WIDTH);
    }

}

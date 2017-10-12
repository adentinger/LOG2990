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

@Injectable()
export class MapConverterService {

    constructor(private converter: RacingUnitConversionService) { }

    public serialize(map: Map): SerializedMap {
        if (map.computeErrors() === MapError.NONE) {const POINTS: Point[] =
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
            const SERIALIZED_POTHOLES: SerializedPothole[] =
                map.potholes.map(
                    (pothole: Pothole) =>
                        new SerializedPothole(
                            this.converter.lengthToGameUnits(pothole.position)));
            const SERIALIZED_PUDDLES: SerializedPuddle[] =
                map.potholes.map(
                    (puddle: Puddle) =>
                        new SerializedPuddle(
                            this.converter.lengthToGameUnits(puddle.position)));
            const SERIALIZED_SPEED_BOOSTS: SerializedSpeedBoost[] =
                map.potholes.map(
                    (speedBoost: SpeedBoost) =>
                        new SerializedSpeedBoost(
                            this.converter.lengthToGameUnits(speedBoost.position)));

            return new SerializedMap(
                map.name,
                map.description,
                map.type,
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

    public deserialize(serializedMap: SerializedMap): Map {
        return null;
    }

}

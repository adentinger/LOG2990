import { Injectable } from '@angular/core';
import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Map } from './map';
import { SerializedMap } from '../../common/racing/serialized-map';

@Injectable()
export class MapConverterService {

    constructor(private converter: RacingUnitConversionService) { }

    public serialize(map: Map): SerializedMap {
        return null;
    }

    public deserialize(serializedMap: SerializedMap): Map {
        return null;
    }

}

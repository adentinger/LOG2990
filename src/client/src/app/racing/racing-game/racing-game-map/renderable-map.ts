import * as THREE from 'three';
import { SerializedMap } from '../../../../../../common/src/racing/serialized-map';
import { Point } from '../../../../../../common/src/math/point';
import { SerializedPothole } from '../../../../../../common/src/racing/serialized-pothole';
import { SerializedPuddle } from '../../../../../../common/src/racing/serialized-puddle';
import { SerializedSpeedBoost } from '../../../../../../common/src/racing/serialized-speed-boost';

export class RenderableMap extends THREE.Mesh {

    public mapName: string;
    public mapPoints: Point[];
    public mapPotholes: SerializedPothole[];
    public mapPuddles: SerializedPuddle[];
    public mapSpeedBoosts: SerializedSpeedBoost[];

    constructor(map: SerializedMap) {
        super();

        console.log('Map: ', map.name);
        this.mapName = map.name;
        this.mapPoints = map.points;
        this.mapPotholes = map.potholes;
        this.mapPuddles = map.puddles;
        this.mapSpeedBoosts = map.speedBoosts;
    }
}

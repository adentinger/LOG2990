import * as THREE from 'three';
import { SerializedMap } from '../../../../../../common/src/racing/serialized-map';
import { Point } from '../../../../../../common/src/math/point';
import { SerializedPothole } from '../../../../../../common/src/racing/serialized-pothole';
import { SerializedPuddle } from '../../../../../../common/src/racing/serialized-puddle';
import { SerializedSpeedBoost } from '../../../../../../common/src/racing/serialized-speed-boost';
import { PhysicMesh } from '../physic/object';
import { RacingGamePlane } from './racing-game-plane';

export class RenderableMap extends PhysicMesh {

    public mapName: string;
    public mapPoints: Point[];
    public mapPotholes: SerializedPothole[];
    public mapPuddles: SerializedPuddle[];
    public mapSpeedBoosts: SerializedSpeedBoost[];

    private readonly plane: RacingGamePlane;
    public readonly waitToLoad: Promise<void>;

    constructor(map: SerializedMap) {
        super();

        this.mapName = map.name;
        this.mapPoints = map.points;
        this.mapPotholes = map.potholes;
        this.mapPuddles = map.puddles;
        this.mapSpeedBoosts = map.speedBoosts;

        this.plane = new RacingGamePlane();
        const wireframePlane = new RacingGamePlane();
        (<THREE.MeshBasicMaterial>wireframePlane.material).wireframe = true;
        (<THREE.MeshBasicMaterial>wireframePlane.material).map = null;
        (<THREE.MeshBasicMaterial>wireframePlane.material).color = new THREE.Color( 0xffffff );
        wireframePlane.rotation.set(0, 0, 0);
        this.plane.add(wireframePlane);
        this.waitToLoad = Promise.all([this.plane.waitToLoad]).then(() => {});

        this.add(this.plane);
    }
}

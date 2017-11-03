import * as THREE from 'three';
import { SerializedMap } from '../../../../../../common/src/racing/serialized-map';
import { Point } from '../../../../../../common/src/math/point';
import { SerializedPothole } from '../../../../../../common/src/racing/serialized-pothole';
import { SerializedPuddle } from '../../../../../../common/src/racing/serialized-puddle';
import { SerializedSpeedBoost } from '../../../../../../common/src/racing/serialized-speed-boost';
import { PhysicMesh } from '../physic/object';
import { RacingGamePlane } from './racing-game-plane';
import { RacetrackSegment } from '../three-objects/racetrack/racetrack-segment';

export class RenderableMap extends PhysicMesh {

    public mapName: string;
    public mapPoints: Point[];
    public mapPotholes: SerializedPothole[];
    public mapPuddles: SerializedPuddle[];
    public mapSpeedBoosts: SerializedSpeedBoost[];

    public PLANE: RacingGamePlane;

    constructor(map: SerializedMap) {
        super();

        this.mapName = map.name;
        this.mapPoints = map.points;
        this.mapPotholes = map.potholes;
        this.mapPuddles = map.puddles;
        this.mapSpeedBoosts = map.speedBoosts;

        this.PLANE = new RacingGamePlane();
        const wireframePlane = new RacingGamePlane();
        (<THREE.MeshBasicMaterial>wireframePlane.material).wireframe = true;
        (<THREE.MeshBasicMaterial>wireframePlane.material).map = null;
        (<THREE.MeshBasicMaterial>wireframePlane.material).color = new THREE.Color(0xffffff);
        wireframePlane.rotation.set(0, 0, 0);
        this.PLANE.add(wireframePlane);

        ///////////////////////////////////
        const segment1 = new RacetrackSegment();
        const segment1Length = this.calculateRoadtrackLength(segment1);
        segment1.position.x = this.mapPoints[0].x + segment1Length / 2;
        segment1.position.z = this.mapPoints[0].y;

        const lol = this.angleBetweenTwoVectors(this.mapPoints[0], this.mapPoints[1]);

        const scaleFactor = this.calculateDistanceBetweenPoints() / segment1Length;
        segment1.scale.x = scaleFactor;
        segment1.rotation.z = lol;


        this.add(segment1);

        this.add(this.PLANE);
    }

    public placeRacetrack(): void {
    }

    public calculateRoadtrackLength(object: THREE.Object3D): number {
        const objectTemp = new THREE.Box3().setFromObject(object);
        return objectTemp.max.z - objectTemp.min.z;
    }

    public calculateDistanceBetweenPoints(): number {
        return this.mapPoints[1].x - this.mapPoints[0].x;
     }

     public angleBetweenTwoVectors(currentPoint: Point, nextPoint: Point): number {
        let angle = (Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x));

        if (angle < 0) {
            angle += 360;
        }
        return angle;
     }

}

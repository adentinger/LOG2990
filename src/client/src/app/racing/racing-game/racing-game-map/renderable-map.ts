import * as THREE from 'three';
import { SerializedMap } from '../../../../../../common/src/racing/serialized-map';
import { Point } from '../../../../../../common/src/math/point';
import { SerializedPothole } from '../../../../../../common/src/racing/serialized-pothole';
import { SerializedPuddle } from '../../../../../../common/src/racing/serialized-puddle';
import { SerializedSpeedBoost } from '../../../../../../common/src/racing/serialized-speed-boost';
import { PhysicMesh } from '../physic/object';
import { RacingGamePlane } from './racing-game-plane';
import { RacetrackSegment } from '../three-objects/racetrack/racetrack-segment';
import { RacetrackJunction } from '../three-objects/racetrack/racetrack-junction';
import { Track } from '../../track';
import { Vector } from '../../../../../../common/src/math/vector';

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
        this.PLANE.position.set(Track.WIDTH_MAX / 2, 0, Track.HEIGHT_MAX / 2);

        ///////////////////////////////////
        const point1 = new THREE.Vector2(this.mapPoints[0].x, this.mapPoints[0].y);
        const point2 = new THREE.Vector2(this.mapPoints[1].x, this.mapPoints[1].y);

        const segmentLength = point1.distanceTo(point2);

        const segment1 = new RacetrackSegment(segmentLength);

        const angle = this.angleBetweenTwoVectors(this.mapPoints[0], this.mapPoints[1]);

        console.log(this.mapPoints[0]);
        segment1.position.add(new THREE.Vector3(this.mapPoints[0].x + segmentLength / 2, 0, -this.mapPoints[0].y));

        // We trace the junctions first (on 0.01 layer)
        for (const i of this.mapPoints) {
            console.log('point - x=' + i.x + ' y=' + i.y);
            const junction = new RacetrackJunction();
            junction.position.add(new THREE.Vector3(i.x, 0, i.y));
            this.add(junction);
        }

        const reference: Vector = new Vector(1.0, 0.0);
        for (let i = 0; i < this.mapPoints.length; i++) {
            const currentPoint = this.mapPoints[i];
            const nextPoint = this.mapPoints[(i + 1) % this.mapPoints.length];
            const segmentVector: Vector = new Vector(nextPoint.x - currentPoint.x, nextPoint.y - currentPoint.y);
            const angleOfSegment = undefined;
            // TODO place segment properly
        }

        this.add(this.PLANE);
    }

    public angleBetweenTwoVectors(currentPoint: Point, nextPoint: Point): number {
        let angle = (Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x));

        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

}

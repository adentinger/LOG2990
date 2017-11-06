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
import { Car } from '../models/car/car';
import { Radians } from '../../types';

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

        this.placeJunctionsOnMap();
        this.placeSegmentsOnMap();

        this.add(this.PLANE);
    }


    public addCars(...cars: Car[]) {
        // Place cars on starting line

        const angleOfFirstSegment: Radians = -new THREE.Vector2(this.mapPoints[1].x - this.mapPoints[0].x,
            this.mapPoints[1].y - this.mapPoints[0].y).angle() - Math.PI / 2;

        const numberOfCars: number = cars.length;
        const startingLineCoordinates = new THREE.Vector3(this.mapPoints[0].x, 0.0, this.mapPoints[0].y);
        const POSITION_INCREMENT = 2;
        const carPlacementOffset: number = (-0.5 * numberOfCars + ((numberOfCars % 2 !== 0) ? - 0.5 : 0)) * POSITION_INCREMENT;
        const position = new THREE.Vector3(1);
        position.add(new THREE.Vector3(carPlacementOffset, 0.0, 0.0));
        cars.forEach((car) => {
            car.rotation.set(0, angleOfFirstSegment, 0);
            car.position.copy(position).applyEuler(new THREE.Euler(0, angleOfFirstSegment, 0));
            car.position.add(startingLineCoordinates);
            position.add(new THREE.Vector3(POSITION_INCREMENT, 0.0, 0.0));
        });
        this.add(...cars);
    }

    private placeJunctionsOnMap() {
        for (const i of this.mapPoints) {
            console.log('point - x=' + i.x + ' y=' + i.y);
            const junction = new RacetrackJunction();
            junction.position.add(new THREE.Vector3(i.x, 0, i.y));
            this.add(junction);
        }
    }

    private placeSegmentsOnMap() {
        for (let i = 0; i < this.mapPoints.length; i++) {
            const nextPoint = (i + 1) % this.mapPoints.length;
            const point1 = new THREE.Vector2(this.mapPoints[i].x, this.mapPoints[i].y);
            const point2 = new THREE.Vector2(this.mapPoints[nextPoint].x, this.mapPoints[nextPoint].y);
            const segmentLength = point1.distanceTo(point2);
            const angle = this.angleBetweenTwoVectors(this.mapPoints[i], this.mapPoints[nextPoint]);
            let segment = new RacetrackSegment(segmentLength);

            const xyTranslation = this.getSegmentXandYTranslation(angle, segmentLength);
            segment = this.translateSegmentInXandYWithExpectedOrientation(segment, angle, xyTranslation.x, xyTranslation.y, i);
            this.add(segment);
        }
    }

    private angleBetweenTwoVectors(currentPoint: Point, nextPoint: Point): number {
        return (Math.atan2(nextPoint.x - currentPoint.x, nextPoint.y - currentPoint.y));
    }

    private getSegmentXandYTranslation(angle: number, segmentLength: number): THREE.Vector2 {
        const opposite = Math.sin(angle) * segmentLength / 2;   // sin(radians) = opposite / hypotenuse
        const adjacent = Math.cos(angle) * segmentLength / 2;   // cos(radians) = adjacent / hypotenuse
        return new THREE.Vector2(opposite, adjacent);
    }

    private translateSegmentInXandYWithExpectedOrientation(segment: RacetrackSegment, angle: number,
        xTranslation: number, yTranslation: number, currentIndex: number) {
        segment.rotation.z += angle;
        segment.position.x = this.mapPoints[currentIndex].x + xTranslation;
        segment.position.z = this.mapPoints[currentIndex].y + yTranslation;

        return segment;
    }

}

import * as THREE from 'three';
import { SerializedMap } from '../../../../../../common/src/racing/serialized-map';
import { Point } from '../../../../../../common/src/math/point';
import { SerializedPothole } from '../../../../../../common/src/racing/serialized-pothole';
import { SerializedPuddle } from '../../../../../../common/src/racing/serialized-puddle';
import { SerializedSpeedBoost } from '../../../../../../common/src/racing/serialized-speed-boost';
import { PhysicMesh } from '../physic/object';
import { RacingGamePlane } from './racing-game-plane';
import { RacetrackSegment } from '../models/racetrack/racetrack-segment';
import { RacetrackJunction } from '../models/racetrack/racetrack-junction';
import { Track } from '../../track';
import { Car } from '../models/car/car';
import { Radians, Meters } from '../../../types';
import { SerializedItem } from '../../../../../../common/src/racing/serialized-item';
import { Line } from '../../../../../../common/src/math/line';
import { Pothole } from '../models/obstacles/pothole';
import { EventManager } from '../../../event-manager.service';
import { Puddle } from '../models/obstacles/puddle';
import { SpeedBooster } from '../models/obstacles/speed-booster';

export class RenderableMap extends PhysicMesh {
    private static readonly ITEM_HEIGHT = 0.03;

    public mapName: string;
    public mapPoints: Point[];
    public mapPotholes: SerializedPothole[];
    public mapPuddles: SerializedPuddle[];
    public mapSpeedBoosts: SerializedSpeedBoost[];

    private readonly plane: RacingGamePlane;
    public readonly waitToLoad: Promise<void>;

    constructor(map: SerializedMap, private eventManager: EventManager) {
        super();

        this.mapName = map.name;
        this.mapPoints = map.points;
        this.mapPotholes = map.potholes;
        this.mapPuddles = map.puddles;
        this.mapSpeedBoosts = map.speedBoosts;

        this.plane = new RacingGamePlane();
        this.plane.position.set(Track.WIDTH_MAX / 2, 0, Track.HEIGHT_MAX / 2);
        this.add(this.plane);

        const waitForJunctions = this.placeJunctionsOnMap();
        const waitForSegments = this.placeSegmentsOnMap();
        this.placeObstaclesOnMap();

        this.waitToLoad = Promise.all([this.plane.waitToLoad, waitForJunctions, waitForSegments]).then(() => { });
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

    private placeJunctionsOnMap(): Promise<void> {
        const waitforJunctions: Promise<void>[] = [];
        for (const i of this.mapPoints) {
            const junction = new RacetrackJunction();
            junction.position.add(new THREE.Vector3(i.x, 0, i.y));
            this.add(junction);
            waitforJunctions.push(junction.waitToLoad);
        }
        return Promise.all(waitforJunctions).then(() => { });
    }

    private placeSegmentsOnMap(): Promise<void> {
        const waitForSegments: Promise<void>[] = [];
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
            waitForSegments.push(segment.waitToLoad);
        }
        return Promise.all(waitForSegments).then(() => { });
    }

    private placeObstaclesOnMap(): void {
        const obstacles: SerializedItem[] = [...this.mapPotholes, ...this.mapPuddles, ...this.mapSpeedBoosts];
        obstacles.forEach((obstacle) => this.placeObstacleOnMap(obstacle));
    }

    private placeObstacleOnMap(item: SerializedItem): void {
        const lines = this.mapPoints.map((point, i, points) => new Line(point, points[(i + 1) % points.length]));
        let position: Meters = item.position;
        for (const line of lines) {
            if (position > line.translation.norm()) {
                position -= line.translation.norm();
            }
            else {
                const point = line.interpollate(position / line.translation.norm());
                const TRACK_WIDTH = 3;
                const randomCoordinateVariation = Math.random() * (2 * TRACK_WIDTH) - TRACK_WIDTH;
                const coordinate = new THREE.Vector3(point.x + randomCoordinateVariation,
                    RenderableMap.ITEM_HEIGHT,
                    point.y + randomCoordinateVariation);
                const mesh = this.getMeshFromItem(item);
                if (mesh != null) {
                    mesh.position.copy(coordinate);
                    this.add(mesh);
                }
                break;
            }
        }
    }

    private getMeshFromItem(item: SerializedItem): THREE.Mesh {
        let mesh: THREE.Mesh = null;
        if (item.type === 'pothole') {
            mesh = new Pothole(this.eventManager);
        }
        else if (item.type === 'puddle') {
            const slipDirection = Math.sign(Math.random() - 0.5); // Generate randomly -1 or 1
            mesh = new Puddle(this.eventManager, slipDirection);
        }
        else if (item.type === 'speedboost') {
            mesh = new SpeedBooster(this.eventManager);
        }
        return mesh;
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

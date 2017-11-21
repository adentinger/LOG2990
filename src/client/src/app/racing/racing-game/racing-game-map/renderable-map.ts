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

const UP = new THREE.Vector3(0, 1, 0);

export class RenderableMap extends PhysicMesh {
    private static readonly ITEM_HEIGHT = 0.03;

    public mapName: string;
    public mapPoints: Point[];
    public mapPotholes: SerializedPothole[];
    public mapPuddles: SerializedPuddle[];
    public mapSpeedBoosts: SerializedSpeedBoost[];

    private readonly plane: RacingGamePlane;
    public readonly waitToLoad: Promise<void>;

    public get mapLines(): Line[] {
        return this.mapPoints.map((point, i, points) => new Line(point, points[(i + 1) % points.length]));
    }

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
        const WIDTH_POSITION_INCREMENT = Track.SEGMENT_WIDTH / 4;
        const LENGTH_POSITION_INCREMENT = 4;
        const carPlacementOffset: number = (-0.5 * numberOfCars + ((numberOfCars % 2 !== 0) ? - 0.5 : 0)) * WIDTH_POSITION_INCREMENT;
        const position = new THREE.Vector3(1);
        position.add(new THREE.Vector3(carPlacementOffset, 0.0, 0.0));
        cars.forEach((car) => {
            car.rotation.set(0, angleOfFirstSegment, 0);
            car.position.copy(position).applyEuler(new THREE.Euler(0, angleOfFirstSegment, 0));
            car.position.add(startingLineCoordinates);
            position.add(new THREE.Vector3(WIDTH_POSITION_INCREMENT, 0.0, LENGTH_POSITION_INCREMENT));
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
        const lines = this.mapLines;

        for (const line of lines) {
            const segmentLength = line.translation.norm();
            const angle = new THREE.Vector2(line.translation.y, line.translation.x).angle();
            const middlePoint = line.interpolate(0.5);
            const segment = new RacetrackSegment(segmentLength);

            segment.rotation.y = angle;
            segment.position.set(middlePoint.x, segment.position.y, middlePoint.y);

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
        const ITEM_WIDTH: Meters = 2;
        const lines = this.mapLines;
        let position: Meters = item.position;
        for (const line of lines) {
            if (position > line.translation.norm()) {
                position -= line.translation.norm();
            }
            else {
                const point = line.interpolate(position / line.translation.norm());
                const lineAngle = new THREE.Vector2(line.translation.y, line.translation.x).angle();
                const randomCoordinateVariation = new THREE.Vector3((Math.random() - 0.5) * (Track.SEGMENT_WIDTH - ITEM_WIDTH))
                    .applyAxisAngle(UP, lineAngle);
                const coordinate = new THREE.Vector3(point.x, RenderableMap.ITEM_HEIGHT, point.y)
                    .add(randomCoordinateVariation);
                const mesh = this.getMeshFromItem(item);
                if (mesh != null) {
                    mesh.position.copy(coordinate);
                    mesh.rotation.y = lineAngle;
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
}

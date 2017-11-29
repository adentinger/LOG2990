import * as THREE from 'three';

import { CarController, CarControllerState } from './car-controller';
import { Car } from '../../models/car/car';
import { EventManager } from '../../../../event-manager.service';
import { Seconds, Meters } from '../../../../types';
import { AFTER_PHYSIC_UPDATE_EVENT, UP_DIRECTION } from '../engine';
import { CarPhysic } from '../../models/car/car-physic';
import { MapPositionAlgorithms } from '../../../../util/map-position-algorithms';
import { Projection } from '../../../../util/projection';
import { Point, Vector } from '../../../../../../../common/src/math';
import { Obstacle } from '../../models/obstacles/obstacle';
import { Class } from '../../../../../../../common/src';
import { Pothole } from '../../models/obstacles/pothole';
import { SpeedBooster } from '../../models/obstacles/speed-booster';
import '../../../../../../../common/src/math/clamp';
import { Puddle } from '../../models/obstacles/puddle';

const OBSTACLE_WEIGHTS: Map<Class<Obstacle>, number> = new Map([
    [Pothole, -0.75],
    [Puddle, -1],
    [SpeedBooster, 0.1]
] as [Class<Obstacle>, number][]);

const MAX_ANGULAR_SPEED = CarPhysic.DEFAULT_TARGET_ANGULAR_SPEED * 1.5;

export class AiCarController extends CarController {
    private static readonly UPDATE_PERIODE = 2; // cycles
    private static readonly THRESHOLD_DISTANCE_TO_SLOW: Meters = 30;

    private cycleCount = 0;

    public constructor(car: Car) {
        super(car);
        EventManager.getInstance().registerClass(this, AiCarController.prototype);
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onAfterPhysicUpdate(event: EventManager.Event<{ deltaTime: Seconds }>): void {
        if (++this.cycleCount >= AiCarController.UPDATE_PERIODE && this.state === CarControllerState.ENABLED) {
            this.cycleCount = 0;
            const carPosition = this.getVectorFromVector3(this.car.position);
            const projectionOfCar = MapPositionAlgorithms.getClosestProjection(carPosition, this.trackLines);

            this.car.angularSpeed =
                this.getAngularSpeedForFollowingTrack(carPosition, projectionOfCar) +
                this.getAngularSpeedForObstacles(carPosition) +
                this.getAngularSpeedForOpponents(carPosition);
            this.car.targetSpeed = this.getTargetSpeedForFollowingTrack(projectionOfCar);
        }
    }

    private getAngularSpeedForFollowingTrack(carPosition: Point, projectionOfCar: Projection): number {
        const distanceFromBeginning = this.getDistanceFromBeginning(projectionOfCar);
        const targetVector = this.getVectorToTarget(carPosition, distanceFromBeginning);

        const angle = this.car.front.angleTo(targetVector);
        const sens = Math.sign(this.car.front.cross(targetVector).dot(UP_DIRECTION));

        return Math.clamp(7 * sens * angle, -MAX_ANGULAR_SPEED, MAX_ANGULAR_SPEED);
    }

    private getVectorToTarget(carPosition: Point, distanceFromBeginning: Meters): THREE.Vector3 {
        const DISTANCE_OF_TARGET_FROM_CAR: Meters = 10;
        return this.getVectorFromPoint(MapPositionAlgorithms.getPointAtGivenDistance(
            distanceFromBeginning + DISTANCE_OF_TARGET_FROM_CAR, this.trackLines).substract(carPosition));
    }

    private getDistanceFromBeginning(projectionOfCar: Projection): Meters {
        let distanceFromBeginning = 0;
        for (const line of this.trackLines) {
            if (line.equals(projectionOfCar.segment)) {
                break;
            }
            distanceFromBeginning += line.length;
        }
        distanceFromBeginning += projectionOfCar.segment.length * Math.clamp(projectionOfCar.interpolation, 0, 1);
        return distanceFromBeginning;
    }

    private getTargetSpeedForFollowingTrack(projection: Projection): number {
        const MIN_ANGLE = Math.PI / 4,
            MAX_ANGLE = 3 * Math.PI / 4,
            ANGLE_RANGE = MAX_ANGLE - MIN_ANGLE;

        const distanceToEndOfSegment = projection.segment.length * Math.clamp(1 - projection.interpolation, 0, 1);
        const nextSegmentIndex = (this.trackLines.findIndex(line => line.equals(projection.segment)) + 1) % this.trackLines.length;
        const nextSegment = this.trackLines[nextSegmentIndex];

        const angleBetweenLines = this.getVectorFromPoint(projection.segment.translation).angleTo(
            this.getVectorFromPoint(nextSegment.translation));
        const normalizedAngle = Math.clamp(angleBetweenLines - MIN_ANGLE, 0, ANGLE_RANGE) / ANGLE_RANGE;
        const angleFactor = Math.clamp(1 - normalizedAngle, 0, 1);

        const speedFactor = (distanceToEndOfSegment < AiCarController.THRESHOLD_DISTANCE_TO_SLOW) ?
            ((1 - angleFactor) * distanceToEndOfSegment + angleFactor * AiCarController.THRESHOLD_DISTANCE_TO_SLOW) /
            (AiCarController.THRESHOLD_DISTANCE_TO_SLOW) : 1;

        return CarPhysic.DEFAULT_TARGET_SPEED * speedFactor;
    }

    private getAngularSpeedForObstacles(carPosition: Point): number {
        let angularSpeed = 0;
        this.obstacles.forEach((obstacle) => {
            angularSpeed += this.getAngularSpeedForObstacle(carPosition, obstacle);
        });
        return angularSpeed;
    }

    private getAngularSpeedForObstacle(carPosition: Point, obstacle: Obstacle): number {
        const DISTANCE_TO_START_AVOIDING: Meters = 10,
            DEFAULT_WEIGHT = 0,
            MIN_FRONT_AVOIDANCE = 0,
            MAX_FRONT_AVOIDANCE = 1;

        let angularSpeed: number;
        const obstaclePosition = this.getVectorFromVector3(obstacle.position);
        const vectorToObstacle = this.getVectorToObstacle(carPosition, obstaclePosition);
        const normalizedVectorToObstacle = vectorToObstacle.clone().normalize();
        const obstacleWeight = OBSTACLE_WEIGHTS.get(obstacle.constructor) || DEFAULT_WEIGHT;

        const lateralAvoidingDirection = Math.sign(this.car.front.cross(normalizedVectorToObstacle).dot(UP_DIRECTION));
        const frontalAvoidanceFactor = Math.clamp(
            this.car.front.dot(normalizedVectorToObstacle),
            MIN_FRONT_AVOIDANCE, MAX_FRONT_AVOIDANCE);
        const distanceToObstacle = Math.max(1, vectorToObstacle.length());

        angularSpeed = CarPhysic.DEFAULT_TARGET_ANGULAR_SPEED *
            obstacleWeight *
            frontalAvoidanceFactor * lateralAvoidingDirection *
            (DISTANCE_TO_START_AVOIDING / distanceToObstacle) ** 2;
        return Math.clamp(angularSpeed, -MAX_ANGULAR_SPEED, MAX_ANGULAR_SPEED);
    }

    private getVectorToObstacle(carPosition: Point, obstaclePosition: Point): THREE.Vector3 {
        const point = new Point(obstaclePosition.x - carPosition.x, obstaclePosition.y - carPosition.y);
        return this.getVectorFromPoint(point);
    }

    private getAngularSpeedForOpponents(carPosition: Point): number {
        let angularSpeed = 0;
        this.opponentsCars.forEach((opponentCar) =>
            angularSpeed += this.getAngularSpeedForOpponent(carPosition, opponentCar));
        return angularSpeed;
    }

    private getAngularSpeedForOpponent(carPosition: Point, opponentCar: Car): number {
        return 0;
    }

    private getVectorFromPoint(point: Point): THREE.Vector3 {
        return new THREE.Vector3(point.x, 0, point.y);
    }

    private getVectorFromVector3(vector: THREE.Vector3): Vector {
        return new Vector(vector.x, vector.z);
    }
}

import { CarController, CarControllerState } from './car-controller';
import { Car } from '../../models/car/car';
import { EventManager } from '../../../../event-manager.service';
import { Seconds, Meters } from '../../../../types';
import { AFTER_PHYSIC_UPDATE_EVENT, UP_DIRECTION } from '../engine';
import { CarPhysic } from '../../models/car/car-physic';
import { MapPositionAlgorithms } from '../../../../util/map-position-algorithms';
import { Projection } from '../../../../util/projection';
import { Point, Vector } from '../../../../../../../common/src/math';
import * as THREE from 'three';
import { Track } from '../../../track';
import '../../../../../../../common/src/math/clamp';

export class AiCarController extends CarController {
    private static readonly UPDATE_PERIODE = 2; // cycles
    private static readonly THRESHOLD_TO_SLOW: Meters = 30;

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
            // Call the physic updates.
            const carPosition = this.getPointFromVector(this.car.position);
            const projection = MapPositionAlgorithms.getClosestProjection(carPosition, this.trackLines);
            this.car.angularSpeed = this.getAngularSpeedForTrack(projection);
            this.car.targetSpeed = this.getTargetSpeed(projection);
        }
    }

    private getAngularSpeedForTrack(projection: Projection): number {
        const TARGET_DISTANCE_FROM_CAR: Meters = 10;

        const carPosition = this.getPointFromVector(this.car.position);

        let distanceFromBeginning = 0;
        for (const line of this.trackLines) {
            if (line.equals(projection.segment)) {
                break;
            }
            distanceFromBeginning += line.length;
        }
        distanceFromBeginning += projection.segment.length * Math.clamp(projection.interpolation, 0, 1);

        const targetVector = this.getVectorFromPoint(MapPositionAlgorithms.getPointAtGivenDistance(
            distanceFromBeginning + TARGET_DISTANCE_FROM_CAR, this.trackLines).substract(carPosition));

        const angle = this.car.front.angleTo(targetVector);
        const sens = Math.sign(this.car.front.cross(targetVector).dot(UP_DIRECTION));

        const MAX_VALUE = CarPhysic.DEFAULT_TARGET_ANGULAR_SPEED * 1.5;
        return Math.clamp(7 * sens * angle, -MAX_VALUE, MAX_VALUE);
    }

    private getTargetSpeed(projection: Projection): number {
        const distanceToEndOfSegment = projection.segment.length * Math.clamp(1 - projection.interpolation, 0, 1);
        const nextSegmentIndex = (this.trackLines.findIndex(line => line.equals(projection.segment)) + 1) % this.trackLines.length;
        const angleFactor = Math.clamp(1 - this.getVectorFromPoint(projection.segment.translation).angleTo(
            this.getVectorFromPoint(this.trackLines[nextSegmentIndex].translation)) / (3 * Math.PI / 2), 0, 1) ** 0.5;
        const speedFactor = (distanceToEndOfSegment < AiCarController.THRESHOLD_TO_SLOW) ?
            angleFactor * (2 * distanceToEndOfSegment + AiCarController.THRESHOLD_TO_SLOW) / (3 * AiCarController.THRESHOLD_TO_SLOW) : 1;
        return CarPhysic.DEFAULT_TARGET_SPEED * speedFactor;
    }

    private getVectorFromPoint(point: Point): THREE.Vector3 {
        return new THREE.Vector3(point.x, 0, point.y);
    }

    private getPointFromVector(vector: THREE.Vector3): Vector {
        return new Vector(vector.x, vector.z);
    }
}

import { CarController, CarControllerState } from './car-controller';
import { Car } from '../../models/car/car';
import { EventManager } from '../../../../event-manager.service';
import { Seconds, Meters } from '../../../../types';
import { AFTER_PHYSIC_UPDATE_EVENT, UP_DIRECTION } from '../engine';
import { CarPhysic } from '../../models/car/car-physic';
import { MapPositionAlgorithms } from '../../../../util/map-position-algorithms';
import { Point, Vector } from '../../../../../../../common/src/math';
import * as THREE from 'three';
import { Track } from '../../../track';
import '../../../../../../../common/src/math/clamp';

export class AiCarController extends CarController {
    private static readonly UPDATE_PERIODE = 5; // cycles

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
            this.car.angularSpeed = this.getAngularSpeedForTrack(event.data.deltaTime);
            this.car.targetSpeed = this.getTargetSpeed();
        }
    }

    private getAngularSpeedForTrack(deltaTime: Seconds): number {
        const TARGET_DISTANCE_FROM_CAR: Meters = 20;

        const carPosition = this.getPointFromVector(this.car.position);
        const projection = MapPositionAlgorithms.getClosestProjection(carPosition, this.trackLines);

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

        return 5 * sens * angle; // (angle + 3 * Math.PI) % (2 * Math.PI) - Math.PI
    }

    private getTargetSpeed(): number {
        return CarPhysic.DEFAULT_TARGET_SPEED - 5;
    }

    private getVectorFromPoint(point: Point): THREE.Vector3 {
        return new THREE.Vector3(point.x, 0, point.y);
    }

    private getPointFromVector(vector: THREE.Vector3): Vector {
        return new Vector(vector.x, vector.z);
    }
}

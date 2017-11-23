import { CarController, CarControllerState } from './car-controller';
import { Car } from '../../models/car/car';
import { EventManager } from '../../../../event-manager.service';
import { Seconds } from '../../../../types';
import { AFTER_PHYSIC_UPDATE_EVENT, UP_DIRECTION } from '../engine';
import { CarPhysic } from '../../models/car/car-physic';
import { MapPositionAlgorithms } from '../../../../util/map-position-algorithms';
import { Point, Vector } from '../../../../../../../common/src/math';
import * as THREE from 'three';
import { Track } from '../../../track';

export class AiCarController extends CarController {
    private static readonly UPDATE_PERIODE = 5; // cycles

    private cycleCount = 0;

    public constructor(car: Car) {
        super(car);
        EventManager.getInstance().registerClass(this, AiCarController.prototype);
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onAfterPhysicUpdate(event: EventManager.Event<{deltaTime: Seconds}>): void {
        if (++this.cycleCount >= AiCarController.UPDATE_PERIODE && this.state === CarControllerState.ENABLED) {
            this.cycleCount = 0;
            // Call the physic updates.
            this.car.targetAngularSpeed = this.getAngularSpeedForTrack();
            this.car.targetSpeed = this.getTargetSpeed();
        }
    }

    private getAngularSpeedForTrack(): number {
        const carPosition = this.getPointFromVector(this.car.position);
        const projection = MapPositionAlgorithms.getClosestProjection(carPosition, this.trackLines);
        const rCar = this.car.position.clone().sub(this.getVectorFromPoint(projection.segment.origin)).normalize();
        const rLine = this.getVectorFromPoint(projection.segment.translation).normalize();
        const side = Math.sign(UP_DIRECTION.dot(rCar.clone().cross(rLine)));

        return side * Math.min(CarPhysic.DEFAULT_TARGET_ANGULAR_SPEED,
            Math.max(UP_DIRECTION.dot(this.car.front.cross(rLine)), CarPhysic.DEFAULT_TARGET_ANGULAR_SPEED));
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

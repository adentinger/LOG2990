import { CarController } from './car-controller';
import { Car } from '../../models/car/car';
import { EventManager } from '../../../../event-manager.service';
import { Seconds } from '../../../../types';
import { AFTER_PHYSIC_UPDATE_EVENT, UP_DIRECTION } from '../engine';
import { CarPhysic } from '../../models/car/car-physic';
import { MapPositionAlgorithms } from '../../../../util/map-position-algorithms';
import { Point, Vector } from '../../../../../../../common/src/math';
import * as THREE from 'three';

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
        if (++this.cycleCount >= AiCarController.UPDATE_PERIODE) {
            this.cycleCount = 0;
            // Call the physic updates.
            this.car.targetAngularSpeed = this.getAngularSpeedForTrack();
            this.car.targetSpeed = this.getTargetSpeed();
        }
    }

    private getAngularSpeedForTrack(): number {
        const projection = MapPositionAlgorithms.getClosestProjection(new Point(this.car.position.x, this.car.position.z), this.trackLines);
        return Math.sign(UP_DIRECTION.dot(this.getVectorFromPoint(projection.segment.translation.normalized())));
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

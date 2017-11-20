import * as THREE from 'three';

import { DynamicCollidableMesh } from '../../physic/dynamic-collidable';
import { Seconds, Newtons } from '../../../../types';
import { PhysicUtils, UP_DIRECTION } from '../../physic/utils';

// The front direction when the rotation is 0.
const INITIAL_FRONT = new THREE.Vector3(0, 0, -1);

const POWER_STEERING_FACTOR = 0.6;

export abstract class CarPhysic extends DynamicCollidableMesh {
    public static readonly DEFAULT_ACCELERATION = 25; // m/s^2
    public static readonly DEFAULT_TARGET_SPEED = 20; // m/s

    public static readonly DEFAULT_ANGULAR_ACCELERATION = 4 * Math.PI; // rad/s^2
    public static readonly DEFAULT_TARGET_ANGULAR_SPEED = 3 * Math.PI / 4; // rad/s

    protected acceleration = CarPhysic.DEFAULT_ACCELERATION;
    public targetSpeed = CarPhysic.DEFAULT_TARGET_SPEED;

    protected angularAcceleration = CarPhysic.DEFAULT_ANGULAR_ACCELERATION;
    public targetAngularSpeed = CarPhysic.DEFAULT_TARGET_ANGULAR_SPEED;

    public get front(): THREE.Vector3 {
        return INITIAL_FRONT.clone().applyEuler(this.rotation);
    }

    public get speed(): number {
        return this.velocity.dot(this.front);
    }

    public updateVelocity(deltaTime: Seconds): void {
        this.updateVelocityDirection();
        this.updateSpeed(deltaTime);

        super.updateVelocity(deltaTime);
    }

    public updateAngularVelocity(deltaTime: Seconds): void {
        this.updateAngularSpeed(deltaTime);
        super.updateAngularVelocity(deltaTime);
    }

    public updateRotation(deltaTime: Seconds): void {
        let speed = this.velocity.length();
        speed = speed === 0 ? DynamicCollidableMesh.MIN_SPEED : speed;
        const powerSteering = POWER_STEERING_FACTOR / speed;
        const rotationRestriction = this.velocity.dot(this.front) * powerSteering;

        const originalAngularVelocity = this.angularVelocity.clone();
        this.angularVelocity.multiplyScalar(rotationRestriction * deltaTime);
        super.updateRotation(deltaTime);
        this.angularVelocity.copy(originalAngularVelocity);
    }

    private updateVelocityDirection(): void {
        this.velocity.copy(this.front.multiplyScalar(this.speed));
    }

    private updateSpeed(deltaTime: Seconds) {
        let speed = this.speed;
        const speedDifference = (this.targetSpeed - speed);
        let accelerationFactor = speedDifference / this.targetSpeed;
        accelerationFactor = this.targetSpeed === 0 ? Math.sign(speedDifference) : accelerationFactor;
        const acceleration = accelerationFactor * this.acceleration;

        speed += acceleration * deltaTime;
        this.velocity.copy(this.front.multiplyScalar(speed));
    }

    private updateAngularSpeed(deltaTime: Seconds): void {
        let angularSpeed = this.angularVelocity.dot(UP_DIRECTION);
        const speedDifference = (this.targetAngularSpeed - angularSpeed);
        let angularAccelerationFactor = speedDifference / this.targetAngularSpeed;
        angularAccelerationFactor = this.targetAngularSpeed === 0 ? Math.sign(speedDifference) : angularAccelerationFactor;
        const angularAcceleration = angularAccelerationFactor * this.angularAcceleration;

        angularSpeed += angularAcceleration * deltaTime;
        this.angularVelocity.copy(UP_DIRECTION).multiplyScalar(angularSpeed);
    }
}

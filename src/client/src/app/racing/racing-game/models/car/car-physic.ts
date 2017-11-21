import * as THREE from 'three';

import { DynamicCollidableMesh } from '../../physic/dynamic-collidable';
import { Seconds } from '../../../../types';
import { PhysicUtils, UP_DIRECTION, BEFORE_PHYSIC_UPDATE_EVENT, AFTER_PHYSIC_UPDATE_EVENT } from '../../physic/engine';
import { UIInputs, KEYBOARD_EVENT } from '../../../services/ui-input.service';
import { EventManager } from '../../../../event-manager.service';

const KEY_FORWARD = 'w';
const KEY_BACK = 's';
const KEY_RIGHT = 'd';
const KEY_LEFT = 'a';

// The front direction when the rotation is 0.
const INITIAL_FRONT = new THREE.Vector3(0, 0, -1);

const POWER_STEERING_FACTOR = 0.8;

export abstract class CarPhysic extends DynamicCollidableMesh {
    public static readonly DEFAULT_ACCELERATION = 20; // m/s^2
    public static readonly DEFAULT_TARGET_SPEED = 30; // m/s

    public static readonly DEFAULT_ANGULAR_ACCELERATION = 3 * Math.PI; // rad/s^2
    public static readonly DEFAULT_TARGET_ANGULAR_SPEED = 3 * Math.PI / 4; // rad/s

    protected acceleration = CarPhysic.DEFAULT_ACCELERATION;
    public targetSpeed = 0; // m/s

    protected angularAcceleration = CarPhysic.DEFAULT_ANGULAR_ACCELERATION;
    public targetAngularSpeed = 0; // rad/s

    protected userInputs: UIInputs;

    public get front(): THREE.Vector3 {
        return INITIAL_FRONT.clone().applyEuler(this.rotation);
    }

    public get speed(): number {
        return this.velocity.dot(this.front);
    }

    public constructor() {
        super();
        EventManager.getInstance().registerClass(this, CarPhysic.prototype);
    }

    public setUIInput(userInputService: UIInputs): void {
        this.userInputs = userInputService;
    }

    public removeUIInput(): void {
        delete this.userInputs;
    }

    public hasUIInput(): boolean {
        return this.userInputs != null;
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

        this.rotation.y += rotationRestriction * this.angularVelocity.y * deltaTime + 2 * Math.PI;
        this.rotation.y %= 2 * Math.PI;
    }

    private updateVelocityDirection(): void {
        this.velocity.copy(this.front.multiplyScalar(this.speed));
    }

    private updateSpeed(deltaTime: Seconds) {
        let speed = this.speed;
        const speedDifference = (this.targetSpeed - speed);
        let accelerationFactor = speedDifference / Math.abs(this.targetSpeed);
        accelerationFactor = this.targetSpeed === 0 ? Math.sign(speedDifference) : accelerationFactor;
        const acceleration = accelerationFactor * this.acceleration;

        speed += acceleration * deltaTime;
        this.velocity.copy(this.front.multiplyScalar(speed));
    }

    private updateAngularSpeed(deltaTime: Seconds): void {
        let angularSpeed = this.angularVelocity.dot(UP_DIRECTION);
        const speedDifference = (this.targetAngularSpeed - angularSpeed);
        let angularAccelerationFactor = speedDifference / Math.abs(this.targetAngularSpeed);
        angularAccelerationFactor = this.targetAngularSpeed === 0 ? Math.sign(speedDifference) : angularAccelerationFactor;
        const angularAcceleration = angularAccelerationFactor * this.angularAcceleration;

        angularSpeed += angularAcceleration * deltaTime;
        this.angularVelocity.copy(UP_DIRECTION).multiplyScalar(angularSpeed);
    }

    @EventManager.Listener(KEYBOARD_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private updateTargetVelocities(): void {
        if (this.userInputs != null) {
            this.targetSpeed = 0;
            if (this.userInputs.isKeyPressed(KEY_FORWARD)) {
                this.targetSpeed += CarPhysic.DEFAULT_TARGET_SPEED;
            }
            if (this.userInputs.isKeyPressed(KEY_BACK)) {
                this.targetSpeed -= CarPhysic.DEFAULT_TARGET_SPEED;
            }

            this.targetAngularSpeed = 0;
            if (this.userInputs.isKeyPressed(KEY_RIGHT)) {
                this.targetAngularSpeed -= CarPhysic.DEFAULT_TARGET_ANGULAR_SPEED;
            }
            if (this.userInputs.isKeyPressed(KEY_LEFT)) {
                this.targetAngularSpeed += CarPhysic.DEFAULT_TARGET_ANGULAR_SPEED;
            }
        }
    }
}

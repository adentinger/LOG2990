import * as THREE from 'three';
import { DynamicPhysicElement, DynamicPhysicMesh } from '../dynamic-object';
import { IPhysicElement } from '../object';
import { PhysicUtils } from '../engine';
import { Seconds } from '../../../types';
import { UIInputs } from '../../ui-input.service';

const FRICTION = 10; // m/s^2
const ACCELERATION = 20; // m/s^2
const DESIRED_SPEED = 10; // m/s

const ANGULAR_FRICTION = Math.PI * 5 / 4; // rad/s^2
const ANGULAR_ACCELERATION = 2 * Math.PI; // rad/s^2
const DESIRED_ANGULAR_SPEED = Math.PI; // rad/s

const KEY_FORWARD = 'w';
const KEY_BACK = 's';
const KEY_RIGHT = 'd';
const KEY_LEFT = 'a';

export class MovableOrthographicCamera extends THREE.OrthographicCamera implements DynamicPhysicElement {

    private userInputService: UIInputs;

    public velocity = new THREE.Vector3();
    public angularVelocity = new THREE.Vector3();

    public update(engine: PhysicUtils, deltaTime: Seconds): void {
        this.applyUserInputs(deltaTime);
        DynamicPhysicMesh.prototype.update.call(this, engine, deltaTime);
    }

    public updatePosition(deltaTime: number): void {
        DynamicPhysicMesh.prototype.updatePosition.call(this, deltaTime);
    }

    public updateVelocity(deltaTime: number): void {
        const velocityDirection = this.velocity.clone().normalize();
        const FRICTION_VECTOR = velocityDirection.multiplyScalar(-FRICTION);
        this.velocity.addScaledVector(FRICTION_VECTOR, deltaTime);
        DynamicPhysicMesh.prototype.updateVelocity.call(this, deltaTime);
    }

    public updateRotation(deltaTime: number): void {
        DynamicPhysicMesh.prototype.updateRotation.call(this, deltaTime);
    }

    public updateAngularVelocity(deltaTime: number): void {
        const angularVelocityDirection = this.angularVelocity.clone().normalize();
        const ANGULAR_FRICTION_VECTOR = angularVelocityDirection.multiplyScalar(-ANGULAR_FRICTION);
        this.angularVelocity.addScaledVector(ANGULAR_FRICTION_VECTOR, deltaTime);
        DynamicPhysicMesh.prototype.updateAngularVelocity.call(this, deltaTime);
    }

    public setUIInput(userInputService: UIInputs): void {
        this.userInputService = userInputService;
    }

    private applyUserInputs(deltaTime: Seconds) {
        if (this.userInputService != null) {
            const accelerationDirection = this.getAccelerationDirection();
            const angularAccelerationDirection = this.getAngularAccelerationDirection();

            const accelerationFactor = (DESIRED_SPEED - accelerationDirection.dot(this.velocity)) / DESIRED_SPEED;
            const angularAccelerationFactor = (DESIRED_ANGULAR_SPEED - angularAccelerationDirection.dot(this.angularVelocity)) /
                DESIRED_ANGULAR_SPEED;

            const acceleration = accelerationDirection.multiplyScalar(ACCELERATION)
                .multiplyScalar(accelerationFactor);
            const angularAcceleration = angularAccelerationDirection.multiplyScalar(ANGULAR_ACCELERATION)
                .multiplyScalar(angularAccelerationFactor);

            this.velocity.addScaledVector(acceleration, deltaTime);
            this.angularVelocity.addScaledVector(angularAcceleration, deltaTime);
        }
    }

    private getAccelerationDirection(): THREE.Vector3 {
        const direction = new THREE.Vector3();
        if (this.userInputService.isKeyPressed(KEY_FORWARD)) {
            direction.z--;
        }
        if (this.userInputService.isKeyPressed(KEY_BACK)) {
            direction.z++;
        }

        return (direction).applyEuler(this.rotation).setY(0).normalize();
    }

    private getAngularAccelerationDirection(): THREE.Vector3 {
        const direction = new THREE.Vector3;
        if (this.userInputService.isKeyPressed(KEY_RIGHT)) {
            direction.y--;
        }
        if (this.userInputService.isKeyPressed(KEY_LEFT)) {
            direction.y++;
        }

        return direction.normalize();
    }
}

export class MovablePerspectiveCamera extends THREE.PerspectiveCamera implements DynamicPhysicElement {

    private userInputService: UIInputs;

    public velocity = new THREE.Vector3();
    public angularVelocity = new THREE.Vector3();

    public update(engine: PhysicUtils, deltaTime: Seconds): void {
        this.applyUserInputs(deltaTime);
        DynamicPhysicMesh.prototype.update.call(this, engine, deltaTime);
    }

    public updatePosition(deltaTime: number): void {
        DynamicPhysicMesh.prototype.updatePosition.call(this, deltaTime);
    }

    public updateVelocity(deltaTime: number): void {
        const velocityDirection = this.velocity.clone().normalize();
        const FRICTION_VECTOR = velocityDirection.multiplyScalar(-FRICTION);
        this.velocity.addScaledVector(FRICTION_VECTOR, deltaTime);
        DynamicPhysicMesh.prototype.updateVelocity.call(this, deltaTime);
    }

    public updateRotation(deltaTime: number): void {
        DynamicPhysicMesh.prototype.updateRotation.call(this, deltaTime);
    }

    public updateAngularVelocity(deltaTime: number): void {
        const angularVelocityDirection = this.angularVelocity.clone().normalize();
        const ANGULAR_FRICTION_VECTOR = angularVelocityDirection.multiplyScalar(-ANGULAR_FRICTION);
        this.angularVelocity.addScaledVector(ANGULAR_FRICTION_VECTOR, deltaTime);
        DynamicPhysicMesh.prototype.updateAngularVelocity.call(this, deltaTime);
    }

    public setUIInput(userInputService: UIInputs): void {
        this.userInputService = userInputService;
    }

    private applyUserInputs(deltaTime: Seconds) {
        if (this.userInputService != null) {
            const accelerationDirection = this.getAccelerationDirection();
            const angularAccelerationDirection = this.getAngularAccelerationDirection();

            const accelerationFactor = (DESIRED_SPEED - accelerationDirection.dot(this.velocity)) / DESIRED_SPEED;
            const angularAccelerationFactor = (DESIRED_ANGULAR_SPEED - angularAccelerationDirection.dot(this.angularVelocity)) /
                DESIRED_ANGULAR_SPEED;

            const acceleration = accelerationDirection.multiplyScalar(ACCELERATION)
                .multiplyScalar(accelerationFactor);
            const angularAcceleration = angularAccelerationDirection.multiplyScalar(ANGULAR_ACCELERATION)
                .multiplyScalar(angularAccelerationFactor);

            this.velocity.addScaledVector(acceleration, deltaTime);
            this.angularVelocity.addScaledVector(angularAcceleration, deltaTime);
        }
    }

    private getAccelerationDirection(): THREE.Vector3 {
        const direction = new THREE.Vector3();
        if (this.userInputService.isKeyPressed(KEY_FORWARD)) {
            direction.z--;
        }
        if (this.userInputService.isKeyPressed(KEY_BACK)) {
            direction.z++;
        }

        return (direction).applyEuler(this.rotation).setY(0).normalize();
    }

    private getAngularAccelerationDirection(): THREE.Vector3 {
        const direction = new THREE.Vector3;
        if (this.userInputService.isKeyPressed(KEY_RIGHT)) {
            direction.y--;
        }
        if (this.userInputService.isKeyPressed(KEY_LEFT)) {
            direction.y++;
        }

        return direction.normalize();
    }
}

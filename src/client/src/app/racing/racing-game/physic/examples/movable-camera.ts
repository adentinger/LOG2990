import * as THREE from 'three';
import { DynamicPhysicElement, DynamicPhysicMesh } from '../dynamic-object';
import { IPhysicElement } from '../object';
import { PhysicEngine } from '../engine';
import { Seconds } from '../../../types';
import { UIInputs } from '../../ui-input.service';

const FRICTION = 10; // m/s^2
const ACCELERATION = 20; // m/s^2
const DESIRED_SPEED = 10; // m/s

const KEY_FORWARD = 'w';
const KEY_BACK = 's';
const KEY_RIGHT = 'd';
const KEY_LEFT = 'a';

export class MovableOrthographicCamera extends THREE.OrthographicCamera implements DynamicPhysicElement {

    private userInputService: UIInputs;

    public velocity = new THREE.Vector3();
    public angularVelocity = new THREE.Vector3();

    public update(engine: PhysicEngine, deltaTime: Seconds): void {
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

    public setUIInput(userInputService: UIInputs): void {
        this.userInputService = userInputService;
    }

    private applyUserInputs(deltaTime: Seconds) {
        if (this.userInputService != null) {
            const accelerationDirection = this.getAccelerationDirection();

            const accelerationFactor = (DESIRED_SPEED - accelerationDirection.dot(this.velocity)) / DESIRED_SPEED;

            const acceleration = accelerationDirection.multiplyScalar(ACCELERATION)
                .multiplyScalar(accelerationFactor);
            this.velocity.addScaledVector(acceleration, deltaTime);
        }
    }

    private getAccelerationDirection() {
        const direction = new THREE.Vector3();
        if (this.userInputService.isKeyPressed(KEY_FORWARD)) {
            direction.z += -1;
        }
        if (this.userInputService.isKeyPressed(KEY_BACK)) {
            direction.z += 1;
        }
        if (this.userInputService.isKeyPressed(KEY_RIGHT)) {
            direction.x += 1;
        }
        if (this.userInputService.isKeyPressed(KEY_LEFT)) {
            direction.x += -1;
        }

        return (direction).applyEuler(this.rotation).setY(0).normalize();
    }
}

export class MovablePerspectiveCamera extends THREE.PerspectiveCamera implements DynamicPhysicElement {

    private userInputService: UIInputs;

    public velocity = new THREE.Vector3();
    public angularVelocity = new THREE.Vector3();

    public update(engine: PhysicEngine, deltaTime: Seconds): void {
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

    public setUIInput(userInputService: UIInputs): void {
        this.userInputService = userInputService;
    }

    private applyUserInputs(deltaTime: Seconds) {
        if (this.userInputService != null) {
            const accelerationDirection = this.getAccelerationDirection();

            const accelerationFactor = (DESIRED_SPEED - accelerationDirection.dot(this.velocity)) / DESIRED_SPEED;

            const acceleration = accelerationDirection.multiplyScalar(ACCELERATION)
                .multiplyScalar(accelerationFactor);
            this.velocity.addScaledVector(acceleration, deltaTime);
        }
    }

    private getAccelerationDirection() {
        const direction = new THREE.Vector3();
        if (this.userInputService.isKeyPressed(KEY_FORWARD)) {
            direction.z += -1;
        }
        if (this.userInputService.isKeyPressed(KEY_BACK)) {
            direction.z += 1;
        }
        if (this.userInputService.isKeyPressed(KEY_RIGHT)) {
            direction.x += 1;
        }
        if (this.userInputService.isKeyPressed(KEY_LEFT)) {
            direction.x += -1;
        }

        return (direction).applyEuler(this.rotation).setY(0).normalize();
    }
}

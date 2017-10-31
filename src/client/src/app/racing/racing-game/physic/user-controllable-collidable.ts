import { DynamicCollidableMesh } from './dynamic-collidable';
import { UIInputs } from '../ui-input.service';
import { PhysicUtils } from './engine';
import { Seconds, Newtons } from '../../types';
import * as THREE from 'three';

const KEY_FORWARD = 'w';
const KEY_BACK = 's';
const KEY_RIGHT = 'd';
const KEY_LEFT = 'a';

export class UserControllableCollidableMesh extends DynamicCollidableMesh {
    protected userInputs: UIInputs;

    protected friction: Newtons = 10;
    protected acceleration: Newtons = 20;
    protected maxSpeed = 10; // m/s

    protected angularFriction: number = Math.PI; // rad/s^2
    protected angularAcceleration = 2 * Math.PI; // rad/s^2
    protected maxAngularSpeed = Math.PI; // rad/s

    public update(engine: PhysicUtils, deltaTime: Seconds) {
        this.applyUserInputs(deltaTime);
        super.update(engine, deltaTime);
    }

    public updateVelocity(deltaTime: number): void {
        const velocityDirection = this.velocity.clone().normalize();
        const FRICTION_VECTOR = velocityDirection.multiplyScalar(-this.friction);
        this.velocity.addScaledVector(FRICTION_VECTOR, deltaTime);
        super.updateVelocity(deltaTime);
    }

    public updateAngularVelocity(deltaTime: number): void {
        const angularVelocityDirection = this.angularVelocity.clone().normalize();
        const ANGULAR_FRICTION_VECTOR = angularVelocityDirection.multiplyScalar(-this.angularFriction);
        this.angularVelocity.addScaledVector(ANGULAR_FRICTION_VECTOR, deltaTime);
        super.updateAngularVelocity(deltaTime);
    }

    public setUIInput(userInputService: UIInputs): void {
        this.userInputs = userInputService;
    }

    private applyUserInputs(deltaTime: Seconds) {
        if (this.userInputs != null) {
            const accelerationDirection = this.getAccelerationDirection();
            const angularAccelerationDirection = this.getAngularAccelerationDirection();

            const accelerationFactor = (this.maxSpeed - accelerationDirection.dot(this.velocity)) / this.maxSpeed;
            const angularAccelerationFactor = (this.maxAngularSpeed - angularAccelerationDirection.dot(this.angularVelocity)) /
                this.maxAngularSpeed;

            const acceleration = accelerationDirection.multiplyScalar(this.acceleration)
                .multiplyScalar(accelerationFactor);
            const angularAcceleration = angularAccelerationDirection.multiplyScalar(this.angularAcceleration)
                .multiplyScalar(angularAccelerationFactor);

            this.velocity.addScaledVector(acceleration, deltaTime);
            this.angularVelocity.addScaledVector(angularAcceleration, deltaTime);
        }
    }

    private getAccelerationDirection(): THREE.Vector3 {
        const direction = new THREE.Vector3();
        if (this.userInputs.isKeyPressed(KEY_FORWARD)) {
            direction.z--;
        }
        if (this.userInputs.isKeyPressed(KEY_BACK)) {
            direction.z++;
        }

        return (direction).applyEuler(this.rotation).setY(0).normalize();
    }

    private getAngularAccelerationDirection(): THREE.Vector3 {
        const direction = new THREE.Vector3;
        if (this.userInputs.isKeyPressed(KEY_RIGHT)) {
            direction.y--;
        }
        if (this.userInputs.isKeyPressed(KEY_LEFT)) {
            direction.y++;
        }

        return direction;
    }
}

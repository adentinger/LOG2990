import { DynamicCollidableMesh } from './dynamic-collidable';
import { UIInputs } from '../../services/ui-input.service';
import { PhysicUtils } from './engine';
import { Seconds, Newtons } from '../../types';
import * as THREE from 'three';

const KEY_FORWARD = 'w';
const KEY_BACK = 's';
const KEY_RIGHT = 'd';
const KEY_LEFT = 'a';

const FRONT = new THREE.Vector3(0, 0, -1);

export class UserControllableCollidableMesh extends DynamicCollidableMesh {
    protected userInputs: UIInputs;

    protected friction: Newtons = 10;
    protected acceleration: Newtons = 20;
    protected maxSpeed = 10; // m/s

    protected angularFriction: number = 2 * Math.PI; // rad/s^2
    protected angularAcceleration = 4 * Math.PI; // rad/s^2
    protected maxAngularSpeed = Math.PI / 2; // rad/s

    protected get front(): THREE.Vector3 {
        return FRONT.clone().applyEuler(this.rotation);
    }

    public update(engine: PhysicUtils, deltaTime: Seconds) {
        this.applyUserInputs(deltaTime);
        super.update(engine, deltaTime);
    }

    public updateVelocity(deltaTime: number): void {
        const velocityDirection = this.velocity.clone().normalize();
        const FRICTION_VECTOR = velocityDirection.multiplyScalar(-this.friction);
        this.velocity.addScaledVector(FRICTION_VECTOR, deltaTime);

        const speed = this.velocity.length();
        const direction = Math.sign(this.velocity.dot(this.front));
        this.velocity.copy(this.front.multiplyScalar(direction * speed));
        super.updateVelocity(deltaTime);
    }

    public updateAngularVelocity(deltaTime: number): void {
        const angularVelocityDirection = this.angularVelocity.clone().normalize();
        const ANGULAR_FRICTION_VECTOR = angularVelocityDirection.multiplyScalar(-this.angularFriction);
        this.angularVelocity.addScaledVector(ANGULAR_FRICTION_VECTOR, deltaTime);
        super.updateAngularVelocity(deltaTime);
    }

    public updateRotation(deltaTime: Seconds): void {}

    public setUIInput(userInputService: UIInputs): void {
        this.userInputs = userInputService;
    }

    private applyUserInputs(deltaTime: Seconds) {
        if (this.userInputs != null) {
            const angularAccelerationDirection = this.getAngularAccelerationDirection();

            const angularAccelerationFactor = (this.maxAngularSpeed - angularAccelerationDirection.dot(this.angularVelocity)) /
                this.maxAngularSpeed;
            const angularAcceleration = angularAccelerationDirection.multiplyScalar(this.angularAcceleration)
                .multiplyScalar(angularAccelerationFactor);
            this.angularVelocity.addScaledVector(angularAcceleration, deltaTime);
            const rotationRestriction = this.velocity.dot(this.front.clone().setY(0)) / this.maxSpeed;
            this.rotation.y = (this.rotation.y + (rotationRestriction * this.angularVelocity.y * this.maxAngularSpeed * deltaTime) +
                2 * Math.PI) % (2 * Math.PI);

            const accelerationDirection = this.getAccelerationDirection();
            const accelerationFactor = (this.maxSpeed - accelerationDirection.dot(this.velocity)) / this.maxSpeed;
            const acceleration = accelerationDirection.multiplyScalar(this.acceleration)
                .multiplyScalar(accelerationFactor);
            this.velocity.addScaledVector(acceleration, deltaTime);
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

import { DynamicCollidableMesh } from './dynamic-collidable';
import { UIInputs } from '../../services/ui-input.service';
import { PhysicUtils } from './engine';
import { Seconds, Newtons } from '../../../types';
import * as THREE from 'three';

const KEY_FORWARD = 'w';
const KEY_BACK = 's';
const KEY_RIGHT = 'd';
const KEY_LEFT = 'a';

const INITIAL_FRONT = new THREE.Vector3(0, 0, -1);

const POWER_STEERING_FACTOR = 0.6;

export class UserControllableCollidableMesh extends DynamicCollidableMesh {
    protected userInputs: UIInputs;

    protected friction: Newtons = 15;
    protected acceleration = 25; // m/s^2
    protected targetSpeed = 20; // m/s

    protected angularFriction: number = 2 * Math.PI; // rad/s^2
    protected angularAcceleration = 4 * Math.PI; // rad/s^2
    protected targetAngularSpeed = 3 * Math.PI / 4; // rad/s

    public get front(): THREE.Vector3 {
        return INITIAL_FRONT.clone().applyEuler(this.rotation);
    }

    public updatePhysic(engine: PhysicUtils, deltaTime: Seconds) {
        this.applyUserInputs(deltaTime);
        super.updatePhysic(engine, deltaTime);
    }

    public updateVelocity(deltaTime: Seconds): void {
        const speed = this.velocity.length();
        const direction = Math.sign(this.velocity.dot(this.front));
        this.velocity.copy(this.front.multiplyScalar(direction * speed));

        const velocityDirection = this.velocity.clone().normalize();
        const FRICTION_VECTOR = velocityDirection.multiplyScalar(-this.friction);
        this.velocity.addScaledVector(FRICTION_VECTOR, deltaTime);

        super.updateVelocity(deltaTime);
    }

    public updateAngularVelocity(deltaTime: Seconds): void {
        const angularVelocityDirection = this.angularVelocity.clone().normalize();
        const ANGULAR_FRICTION_VECTOR = angularVelocityDirection.multiplyScalar(-this.angularFriction);
        this.angularVelocity.addScaledVector(ANGULAR_FRICTION_VECTOR, deltaTime);
        super.updateAngularVelocity(deltaTime);
    }

    public updateRotation(deltaTime: Seconds): void {}

    public setUIInput(userInputService: UIInputs): void {
        this.userInputs = userInputService;
    }

    public removeUIInput(): void {
        delete this.userInputs;
    }

    public hasUIInput(): boolean {
        return this.userInputs != null;
    }

    private applyUserInputs(deltaTime: Seconds) {
        if (this.userInputs != null) {
            const angularAccelerationDirection = this.getAngularAccelerationDirection();

            const angularAccelerationFactor = (this.targetAngularSpeed - angularAccelerationDirection.dot(this.angularVelocity)) /
                this.targetAngularSpeed;
            const angularAcceleration = angularAccelerationDirection.multiplyScalar(this.angularAcceleration)
                .multiplyScalar(angularAccelerationFactor);
            this.angularVelocity.addScaledVector(angularAcceleration, deltaTime);

            let speed = this.velocity.length();
            speed = speed === 0 ? UserControllableCollidableMesh.MIN_SPEED : this.velocity.length();
            const powerSteering = POWER_STEERING_FACTOR / speed;
            const rotationRestriction = this.velocity.dot(this.front) * powerSteering;
            this.rotation.y = (this.rotation.y + (rotationRestriction * this.angularVelocity.y * deltaTime) +
                2 * Math.PI) % (2 * Math.PI);

            const accelerationDirection = this.getAccelerationDirection();
            const accelerationFactor = (this.targetSpeed - accelerationDirection.dot(this.velocity)) / this.targetSpeed;
            const acceleration = accelerationDirection.multiplyScalar(this.acceleration + this.friction)
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

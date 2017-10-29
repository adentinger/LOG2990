import { IPhysicElement, PhysicMesh } from './object';
import * as THREE from 'three';
import { PhysicUtils } from './engine';
import { Seconds } from '../../types';

export interface DynamicPhysicElement extends IPhysicElement {
    velocity: THREE.Vector3; // meters / seconds
    angularVelocity: THREE.Vector3; // radiants / seconds
    updatePosition(deltaTime: Seconds): void;
    updateVelocity(deltaTime: Seconds): void;
    updateRotation(deltaTime: Seconds): void;
    updateAngularVelocity(deltaTime: Seconds): void;
}

export abstract class DynamicPhysicMesh extends PhysicMesh implements DynamicPhysicElement {
    public static readonly MIN_SPEED = 0.05; // m/s
    public static readonly MIN_ANGULAR_SPEED = 0.005 * Math.PI; // rad/s

    public velocity: THREE.Vector3 = new THREE.Vector3();
    public angularVelocity: THREE.Vector3 = new THREE.Vector3();

    public update(engine: PhysicUtils, deltaTime: Seconds): void {
        super.update(engine, deltaTime);
        this.updateVelocity(deltaTime);
        this.updateAngularVelocity(deltaTime);

        this.updatePosition(deltaTime);
        this.updateRotation(deltaTime);
    }

    public updatePosition(deltaTime: Seconds): void {
        this.position.addScaledVector(this.velocity, deltaTime); // x = x0 + v*t
    }

    public updateVelocity(deltaTime: Seconds): void {
        if (this.velocity.length() < DynamicPhysicMesh.MIN_SPEED) {
            this.velocity.set(0, 0, 0);
        }
        this.velocity.setY(0);
    }

    public updateRotation(deltaTime: Seconds): void {
        const rotation = new THREE.Quaternion().setFromEuler(this.rotation);
        const angularVelocityAngleRate = this.angularVelocity.length();
        const angularVelocityDirection = this.angularVelocity.clone().normalize();

        const deltaRotation = new THREE.Quaternion()
            .setFromAxisAngle(angularVelocityDirection, angularVelocityAngleRate * deltaTime);
        const newRotation = rotation.premultiply(deltaRotation);

        this.rotation.setFromQuaternion(newRotation);
    }

    public updateAngularVelocity(deltaTime: Seconds): void {
        if (this.angularVelocity.length() < DynamicPhysicMesh.MIN_ANGULAR_SPEED) {
            this.angularVelocity.set(0, 0, 0);
        }
        this.angularVelocity.multiply(new THREE.Vector3(0, 1, 0));
    }
}

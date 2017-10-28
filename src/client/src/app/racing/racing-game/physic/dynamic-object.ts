import { IPhysicElement, PhysicMesh } from './object';
import * as THREE from 'three';
import { PhysicEngine } from './engine';
import { Seconds } from '../../types';

export interface DynamicPhysicElement extends IPhysicElement {
    velocity: THREE.Vector3; // meters / seconds
    angularVelocity: THREE.Vector3; // radiants / seconds
    updatePosition(deltaTime: Seconds): void;
    updateVelocity(deltaTime: Seconds): void;
}

export abstract class DynamicPhysicMesh extends PhysicMesh implements DynamicPhysicElement {
    public static readonly MIN_SPEED = 0.05; // m/s
    public static readonly MIN_ACCELERATION = 0.05; // m/s^2

    public velocity: THREE.Vector3 = new THREE.Vector3();
    public angularVelocity: THREE.Vector3 = new THREE.Vector3();

    public update(engine: PhysicEngine, deltaTime: Seconds): void {
        super.update(engine, deltaTime);
        this.updateVelocity(deltaTime);
        this.updatePosition(deltaTime);
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
}

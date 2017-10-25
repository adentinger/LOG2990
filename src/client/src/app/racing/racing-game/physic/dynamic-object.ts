import { IPhysicElement, PhysicMesh } from './object';
import * as THREE from 'three';
import { PhysicEngine } from './engine';
import { Seconds } from '../../types';

export interface DynamicPhysicElement extends IPhysicElement {
    velocity: THREE.Vector3; // meters / seconds
}

export abstract class DynamicPhysicMesh extends PhysicMesh implements DynamicPhysicElement {
    public static MIN_SPEED = 0.05; // m/s

    public velocity: THREE.Vector3 = new THREE.Vector3(0);

    public update(engine: PhysicEngine, deltaTime: Seconds): void {
        super.update(engine, deltaTime);
        // this.velocity.addScaledVector(PhysicEngine.G, deltaTime);
        if (this.velocity.length() < DynamicPhysicMesh.MIN_SPEED) {
            this.velocity.set(0, 0, 0);
        }
        this.velocity.setY(0);
        this.position.addScaledVector(this.velocity, deltaTime);
    }
}

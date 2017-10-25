import * as THREE from 'three';
import { DynamicPhysicElement, DynamicPhysicMesh } from '../dynamic-object';
import { IPhysicElement } from '../object';
import { PhysicEngine } from '../engine';
import { Seconds } from '../../../types';

export class MovableCamera extends THREE.Camera implements DynamicPhysicElement {
    public velocity = new THREE.Vector3();
    public children: IPhysicElement[];
    public update(engine: PhysicEngine, deltaTime: Seconds): void {
        DynamicPhysicMesh.prototype.update.call(this, engine, deltaTime);
    }
}

export class MovablePerspectiveCamera extends THREE.PerspectiveCamera implements DynamicPhysicElement {
    public velocity = new THREE.Vector3();
    public children: IPhysicElement[];
    public update(engine: PhysicEngine, deltaTime: Seconds): void {
        this.velocity.addScaledVector(PhysicEngine.G.clone().negate(), deltaTime);
        DynamicPhysicMesh.prototype.update.call(this, engine, deltaTime);
    }
}

import * as THREE from 'three';
import { DynamicPhysicElement, DynamicPhysicMesh } from '../dynamic-object';
import { IPhysicElement } from '../object';
import { PhysicEngine } from '../engine';
import { Seconds } from '../../../types';

export class MovableOrthographicCamera extends THREE.OrthographicCamera implements DynamicPhysicElement {
    public velocity = new THREE.Vector3();
    public children: IPhysicElement[];
    public update(engine: PhysicEngine, deltaTime: Seconds): void {
        DynamicPhysicMesh.prototype.update.call(this, engine, deltaTime);
    }
}
MovableOrthographicCamera.prototype['updatePosition'] = DynamicPhysicMesh.prototype['updatePosition'];
MovableOrthographicCamera.prototype['updateVelocity'] = DynamicPhysicMesh.prototype['updateVelocity'];

export class MovablePerspectiveCamera extends THREE.PerspectiveCamera implements DynamicPhysicElement {
    private static readonly FRICTION = -10; // N

    public velocity = new THREE.Vector3();
    public children: IPhysicElement[];
    public update(engine: PhysicEngine, deltaTime: Seconds): void {
        const FRICTION = this.velocity.clone().normalize().multiplyScalar(MovablePerspectiveCamera.FRICTION);
        this.velocity.addScaledVector(FRICTION, deltaTime);
        DynamicPhysicMesh.prototype.update.call(this, engine, deltaTime);
    }
}
MovablePerspectiveCamera.prototype['updatePosition'] = DynamicPhysicMesh.prototype['updatePosition'];
MovablePerspectiveCamera.prototype['updateVelocity'] = DynamicPhysicMesh.prototype['updateVelocity'];

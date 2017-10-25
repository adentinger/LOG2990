import { IPhysicElement, PhysicMesh } from './object';
import * as THREE from 'three';
import { PhysicEngine } from './engine';
import { Seconds } from '../../types';
import { DynamicPhysicMesh, DynamicPhysicElement } from './dynamic-object';
import { Collidable } from './collidable';

export interface DynamicCollidable extends DynamicPhysicElement, Collidable {
    velocity: THREE.Vector3; // m/s
}

export abstract class DynamicCollidableMesh extends DynamicPhysicMesh implements DynamicCollidable {
    public static readonly SPEED_FORCE_PROPORTIONALITY = 1.0; // in N/(m/s)

    public geometry: THREE.Geometry;
    public velocity: THREE.Vector3 = new THREE.Vector3(0);

    public update(engine: PhysicEngine, deltaTime: Seconds): void {
        const forceDirections = this.getForceFromCollisions(engine, deltaTime);
        forceDirections.forEach((direction: THREE.Vector3) => {
            const force = this.velocity.dot(direction) * DynamicCollidableMesh.SPEED_FORCE_PROPORTIONALITY;
            this.velocity.addScaledVector(direction, force * deltaTime);
        });

        super.update(engine, deltaTime);
    }

    protected getForceFromCollisions(engine: PhysicEngine, deltaTime: Seconds) {
        const collidingObjects: Collidable[] = engine.getObjectsCollidingWith(this);
        if (collidingObjects.length > 0) {
            console.log('Collision', this.position, collidingObjects);
        }
        return collidingObjects.map((object: Collidable) => object.position.clone().sub(this.position).normalize());
    }
}

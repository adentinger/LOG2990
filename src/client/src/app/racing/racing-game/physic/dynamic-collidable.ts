import * as THREE from 'three';
import { PhysicUtils } from './engine';
import { Seconds, Kilograms } from '../../types';
import { DynamicPhysicMesh, DynamicPhysicElement } from './dynamic-object';
import { Collidable } from './collidable';

export interface DynamicCollidable extends DynamicPhysicElement, Collidable {
    velocity: THREE.Vector3; // m/s
}

export abstract class DynamicCollidableMesh extends DynamicPhysicMesh implements DynamicCollidable {
    public static readonly SPEED_FORCE_PROPORTIONALITY = 1.0; // in N/(m/s)

    public geometry: THREE.Geometry;
    public mass: Kilograms = 1;
    public velocity: THREE.Vector3 = new THREE.Vector3(0);

    public update(engine: PhysicUtils, deltaTime: Seconds): void {
        const forceDirections = this.getForceFromCollisions(engine, deltaTime);
        forceDirections.forEach((direction: THREE.Vector3) => {
            const force = -DynamicCollidableMesh.SPEED_FORCE_PROPORTIONALITY;
            this.velocity.addScaledVector(direction, force * deltaTime);
        });

        this.velocity.addScaledVector(PhysicUtils.G, deltaTime);
        super.update(engine, deltaTime);
    }

    protected getForceFromCollisions(engine: PhysicUtils, deltaTime: Seconds) {
        const collidingObjects: Collidable[] = engine.getObjectsCollidingWith(this);
        if (collidingObjects.length > 0) {
            // console.log('Collision', this.position, collidingObjects);
        }
        return collidingObjects.map((object: Collidable) => object.position.clone().sub(this.position).normalize());
    }
}

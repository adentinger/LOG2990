import * as THREE from 'three';
import { IPhysicElement, PhysicMesh } from './object';
import { Kilograms } from '../../types';

export interface Collidable extends IPhysicElement {
    geometry: THREE.Geometry;
    mass: Kilograms;
}

export abstract class CollidableMesh extends PhysicMesh implements Collidable {
    public geometry: THREE.Geometry;
    public mass: Kilograms = Infinity; // Immovable by default
    protected arrow: THREE.ArrowHelper = new THREE.ArrowHelper(new THREE.Vector3(), this.position);
}

export function isCollidable(object: IPhysicElement): object is Collidable {
    return object != null && 'geometry' in object &&
        'mass' in object && typeof object['mass'] === 'number';
}

export interface CollisionInfo {
    /**
     * The object on which the effects of the collision are calculated.
     */
    target: Collidable;
    /**
     * The object colliding with the target.
     */
    source: Collidable;

    /**
     * The collision point relative to the target.
     */
    applicationPoint: THREE.Vector2;

    /**
     * The normal force applied at the collision point.
     */
    force: THREE.Vector2;
}

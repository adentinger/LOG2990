import * as THREE from 'three';
import { IPhysicElement, PhysicMesh } from './object';
import { Kilograms } from '../../types';
import { Point } from '../../../../../../common/src/math/point';

export interface Collidable extends IPhysicElement {
    geometry: THREE.Geometry;
    mass: Kilograms;
}

export abstract class CollidableMesh extends PhysicMesh implements Collidable {
    public geometry: THREE.Geometry;
    public mass: Kilograms = Infinity; // Immovable by default
}

export function isCollidable(object: IPhysicElement): object is Collidable {
    return object != null && 'geometry' in object && object['geometry'] instanceof THREE.Geometry &&
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
     * The collision point relative to the target. The array will contain 1 point if the collision
     * area is a point, 2 points if the collision area is a line.
     */
    positions: Point[];
}

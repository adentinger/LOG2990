import * as THREE from 'three';
import { IPhysicElement, PhysicMesh } from './object';
import { PhysicEngine } from './engine';
import { Seconds } from '../../types';
import { NotImplementedError } from '../../../../../../common/src/utils';

export interface Collidable extends IPhysicElement {
    geometry: THREE.Geometry;
}

export abstract class CollidableMesh extends PhysicMesh implements Collidable {
    public geometry: THREE.Geometry;
}

export function isCollidable(object: IPhysicElement): object is Collidable {
    return object != null && 'geometry' in object && object['geometry'] instanceof THREE.Geometry;
}

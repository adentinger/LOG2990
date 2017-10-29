import * as THREE from 'three';
import { PhysicUtils } from './physic-utils';
import { Seconds } from '../../types';

export interface IPhysicElement extends THREE.Object3D {
    position: THREE.Vector3;
    rotation: THREE.Euler;

    update(engine: PhysicUtils, deltaTime: Seconds): void;
}

export abstract class PhysicMesh extends THREE.Mesh implements IPhysicElement {
    public castShadow = true;
    public receiveShadow = true;
    public update(engine: PhysicUtils, deltaTime: Seconds) { }
}

export function isPhysicElement(object: THREE.Object3D): object is IPhysicElement {
    return object != null &&
        'update' in object && typeof object['update'] === 'function' && object['update'].length >= 2 &&
        'position' in object && object['position'] instanceof THREE.Vector3 &&
        'rotation' in object && object['rotation'] instanceof THREE.Euler;
}

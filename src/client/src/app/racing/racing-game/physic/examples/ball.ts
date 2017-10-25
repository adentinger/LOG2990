import * as THREE from 'three';
import { IPhysicElement, PhysicMesh } from '../object';
import { PhysicEngine } from '../engine';
import { NotImplementedError } from '../../../../../../../common/src/utils';
import { DynamicCollidableMesh } from '../dynamic-collidable';

export class Ball extends DynamicCollidableMesh {

    constructor(public readonly radius: number) {
        super();
        this.geometry = new THREE.SphereGeometry(radius, 20, 10);
        this.material = new THREE.MeshPhongMaterial({color: 0xff0000});
    }
}

import * as THREE from 'three';
import { IPhysicElement, PhysicMesh } from '../object';
import { PhysicEngine } from '../engine';
import { NotImplementedError } from '../../../../../../../common/src/utils';
import { DynamicCollidableMesh } from '../dynamic-collidable';

export class Ball extends DynamicCollidableMesh {

    constructor(public readonly radius: number) {
        super();
        this.geometry = new THREE.SphereGeometry(radius, 20, 10);
        this.geometry.vertices.forEach((value, i, array) => {
            value.add(new THREE.Vector3(0, radius, 0));
        });
        this.material = new THREE.MeshPhongMaterial({color: 0xff0000});
    }
}

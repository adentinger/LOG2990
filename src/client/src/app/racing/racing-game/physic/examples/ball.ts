import * as THREE from 'three';
import { IPhysicElement, PhysicMesh } from '../object';
import { PhysicEngine } from '../engine';
import { NotImplementedError } from '../../../../../../../common/src/utils';
import { DynamicCollidableMesh } from '../dynamic-collidable';

export class Ball extends DynamicCollidableMesh {

    public readonly boundingBox;

    constructor(public readonly radius: number) {
        super();
        this.geometry = new THREE.SphereGeometry(radius, 20, 10);
        this.geometry.vertices.forEach((vertex, i, array) => {
            vertex.add(new THREE.Vector3(0, radius, 0));
        });
        this.geometry.computeBoundingBox();
        this.boundingBox = this.geometry.boundingBox;
        this.material = new THREE.MeshPhongMaterial({color: 0xff0000});
    }
}

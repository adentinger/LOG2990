import * as THREE from 'three';
import { DynamicCollidableMesh } from '../dynamic-collidable';
import { Kilograms } from '../../../types';

export class Ball extends DynamicCollidableMesh {

    public readonly boundingBox;

    constructor(public readonly radius: number, public mass: Kilograms = 1) {
        super();
        this.geometry = new THREE.SphereGeometry(radius, 20, 10);
        this.geometry.vertices.forEach((vertex, i, array) => {
            vertex.add(new THREE.Vector3(0, radius + 0.001, 0));
        });
        this.geometry.computeBoundingBox();
        this.boundingBox = this.geometry.boundingBox;
        this.material = new THREE.MeshPhongMaterial({color: 0xff0000});
    }
}

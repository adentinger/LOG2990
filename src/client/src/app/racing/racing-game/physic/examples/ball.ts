import * as THREE from 'three';
import { DynamicCollidableMesh } from '../dynamic-collidable';
import { Kilograms, Seconds } from '../../../types';
import { UIInputs } from '../../ui-input.service';
import { PhysicUtils } from '../engine';

export class Cube extends DynamicCollidableMesh {
    constructor(public readonly radius: number, public mass: Kilograms = 1) {
        super();
        this.geometry = new THREE.CubeGeometry(radius * 2, radius * 2, radius * 2);
        this.geometry.vertices.forEach((vertex, i, array) => {
            vertex.add(new THREE.Vector3(0, radius + 0.001, 0));
        });
        this.material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    }
}

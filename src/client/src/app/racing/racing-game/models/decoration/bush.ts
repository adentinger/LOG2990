import * as THREE from 'three';
import { CollidableMesh } from '../../physic/collidable';

export class Bush extends CollidableMesh {

    constructor() {
        super(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({color: 0x006600}));
        this.position.set(0, 1, 0);
        this.geometry.computeBoundingBox();
        console.log('Bush', this.geometry.boundingBox);
    }
}

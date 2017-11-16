import * as THREE from 'three';
import { CollidableMesh } from '../../physic/collidable';

export class Tree extends CollidableMesh {

    constructor() {
        super(new THREE.BoxGeometry(2, 4, 2), new THREE.MeshBasicMaterial({color: 0x40A454}));
        this.position.set(0, 2, 0);
    }
}


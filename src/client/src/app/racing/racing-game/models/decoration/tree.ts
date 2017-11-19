import * as THREE from 'three';
import { Decoration } from './decoration';

export class Tree extends Decoration {

    constructor() {
        super(new THREE.BoxGeometry(2, 4, 2), new THREE.MeshBasicMaterial({color: 0x40A454}));
        this.position.set(0, 2, 0);
    }
}


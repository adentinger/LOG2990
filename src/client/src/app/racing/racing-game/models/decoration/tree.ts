import * as THREE from 'three';
import { Decoration } from './decoration';

export class Tree extends Decoration {

    constructor() {
        super(new THREE.BoxGeometry(2, 4, 2).translate(0, 2, 0),
            new THREE.MeshPhongMaterial({ specular: 10, color: 0x40A454}));
    }
}


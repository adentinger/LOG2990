import * as THREE from 'three';
import { Decoration } from './decoration';

export class Bush extends Decoration {

    constructor() {
        super(new THREE.BoxGeometry(2, 2, 2).translate(0, 1, 0),
            new THREE.MeshPhongMaterial({ specular: 10, color: 0x006600}));
        this.geometry.computeBoundingBox();
    }
}

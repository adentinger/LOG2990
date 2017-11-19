import * as THREE from 'three';
import { Decoration } from './decoration';

export class Building extends Decoration {

    constructor() {
        super(new THREE.BoxGeometry(3, 10, 5), new THREE.MeshBasicMaterial({color: 0xA47840}));
        this.position.set(0, 5, 0);
        this.geometry.computeBoundingBox();
        console.log('Building', this.geometry.boundingBox);
    }
}

import * as THREE from 'three';
import { CollidableMesh } from '../../physic/collidable';

export class Building extends CollidableMesh {

    constructor() {
        super(new THREE.BoxGeometry(3, 10, 5), new THREE.MeshBasicMaterial({color: 0xA47840}));
        this.position.set(0, 5, 0);
        this.geometry.computeBoundingBox();
        console.log('Building', this.geometry.boundingBox);
    }
}

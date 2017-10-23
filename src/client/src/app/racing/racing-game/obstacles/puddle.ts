import * as THREE from 'three';

export class Puddle extends THREE.Mesh {

    constructor () {
        super();
        const texture = THREE.ImageUtils.loadTexture('./assets/racing/puddle.jpg');
        this.geometry = new THREE.CircleGeometry( 100, 40 );
        this.material = new THREE.MeshBasicMaterial({ map: texture });
    }

    private static putTexture() {
        return null;
    }
}

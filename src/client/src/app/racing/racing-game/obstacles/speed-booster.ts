import * as THREE from 'three';

export class SpeedBooster extends THREE.Mesh {

    constructor () {
        super();
        const texture = THREE.ImageUtils.loadTexture('./assets/racing/speed-boost.png');
        this.geometry = new THREE.BoxGeometry( 300, 200, 0 );
        this.material = new THREE.MeshBasicMaterial( { map: texture } );
    }

    private static putTexture() {
        return null;
    }
}

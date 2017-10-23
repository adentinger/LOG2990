import * as THREE from 'three';

export class SpeedBooster extends THREE.Mesh {

    constructor () {
        super();
        this.geometry = new THREE.BoxGeometry( 300, 200, 0 );
        this.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    }

    private static putTexture() {
        return null;
    }
}

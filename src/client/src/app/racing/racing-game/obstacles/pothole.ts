import * as THREE from 'three';

export class Pothole extends THREE.Mesh {

    constructor () {
        super();
        this.geometry = new THREE.CircleGeometry( 100, 40 );
        this.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    }

    private static putTexture() {
        return null;
    }
}

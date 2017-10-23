import * as THREE from 'three';

export class Puddle extends THREE.Mesh {

    constructor () {
        super();
        this.geometry = new THREE.CircleGeometry( 100, 40 );
        this.material = new THREE.MeshBasicMaterial( { color: 0x92acc5 } );
    }

    private static putTexture() {
        return null;
    }
}

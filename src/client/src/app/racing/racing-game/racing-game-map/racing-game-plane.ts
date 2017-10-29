import * as THREE from 'three';
import { Track } from '../../track';
import { Meters } from '../../types';

export class RacingGamePlane extends THREE.Mesh {

    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry(Track.WIDTH_MAX, Track.HEIGHT_MAX, 100, 100);
        const texture = THREE.ImageUtils.loadTexture('/assets/racing/textures/grass.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(500, 500);
        this.material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
        this.rotateX(Math.PI / 2);
    }
}

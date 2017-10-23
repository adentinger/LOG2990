import * as THREE from 'three';
import { Track } from '../../track';
import { Meters } from '../../types';

export class RacingGamePlane extends THREE.Mesh {

    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry( Track.WIDTH_MAX, Track.HEIGHT_MAX, 50, 50);
        this.material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    }
}

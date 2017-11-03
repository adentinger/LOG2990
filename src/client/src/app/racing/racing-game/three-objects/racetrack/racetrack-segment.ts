import * as THREE from 'three';
import { Meters } from '../../../types';
import { PhysicMesh } from '../../physic/object';

export class RacetrackSegment extends PhysicMesh {

    public static readonly mass = 0;

    // private static readonly radius = 20;
    // private static readonly segments = 4;

    constructor(radius: Meters = 20, segments: number = 4) {
        super(new THREE.CircleGeometry(radius, segments));
        const texture = THREE.ImageUtils.loadTexture('./assets/racing/ground_asphalt_old_07.png');
        this.material = new THREE.MeshBasicMaterial({ map: texture });
    }
}

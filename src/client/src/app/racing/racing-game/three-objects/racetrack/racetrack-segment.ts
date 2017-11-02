import * as THREE from 'three';
import { CollidableMesh } from '../../physic/collidable';
import { Meters } from '../../../types';

export class RacetrackSegment extends CollidableMesh {

    private readonly texture = THREE.ImageUtils.loadTexture('./assets/racing/ground_asphalt_old_07.png');
    public readonly mass = Infinity;

    constructor(radius: Meters, segments: number) {

        super(new THREE.CircleGeometry(radius, segments));

        this.material = new THREE.MeshBasicMaterial({ map: this.texture });

    }

}

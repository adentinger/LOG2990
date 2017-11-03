import * as THREE from 'three';
import { Meters } from '../../../types';
import { PhysicMesh } from '../../physic/object';

export class RacetrackSegment extends PhysicMesh {

    public static readonly mass = 0;

    private static readonly RADIUS = 10;
    private static readonly SEGMENTS = 4;

    constructor() {
        super(new THREE.CircleGeometry(RacetrackSegment.RADIUS, RacetrackSegment.SEGMENTS));
        const texture = THREE.ImageUtils.loadTexture('../../../../../assets/racing/textures/ground_asphalt_old_07.png');
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.rotation.x = 3 * Math.PI / 2;
        this.position.z = -10;
        this.position.y = 0.01;
        this.rotation.z = Math.PI / 4;
    }
}

import * as THREE from 'three';
import { CollidableMesh } from '../../physic/collidable';
import { Track } from '../../../track';

export class RacetrackSegment extends THREE.Mesh {

    public static readonly mass = 0;

    public readonly length;

    constructor(segmentLength: number) {
        super(new THREE.PlaneBufferGeometry(Track.SEGMENT_WIDTH, segmentLength));
        const texture = THREE.ImageUtils.loadTexture('assets/racing/textures/ground_asphalt_old_07.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(6, 6);
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.rotation.x = 3 * Math.PI / 2;
        this.position.add(new THREE.Vector3(0, 0.02, 0)); // segment must be on top to support other textures

        this.length = segmentLength;
    }
}

import * as THREE from 'three';
import { CollidableMesh } from '../../physic/collidable';
import { Track } from '../../../track';

export class RacetrackJunction extends THREE.Mesh {

    public static readonly mass = 0;
    public static textureLoader = new THREE.TextureLoader();

    private static readonly RADIUS = Track.SEGMENT_WIDTH / 2;
    private static readonly SEGMENTS = 50;

    constructor() {
        super(new THREE.CircleGeometry(RacetrackJunction.RADIUS, RacetrackJunction.SEGMENTS));
        const texture = RacetrackJunction.textureLoader.load('assets/racing/textures/ground_asphalt_old_07.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(6, 6);
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.rotation.x = -Math.PI / 2;
        this.position.add(new THREE.Vector3(0, 0.01, 0));
    }
}

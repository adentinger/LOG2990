import * as THREE from 'three';
import { CollidableMesh } from '../../physic/collidable';

export class RacetrackJunction extends THREE.Mesh {

    public static readonly mass = 0;

    private static readonly RADIUS = 10;
    private static readonly SEGMENTS = 50;

    constructor() {
        super(new THREE.CircleGeometry(RacetrackJunction.RADIUS, RacetrackJunction.SEGMENTS));
        const texture = THREE.ImageUtils.loadTexture('../../../../../assets/racing/textures/ground_asphalt_old_07.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(2, 2);
        texture.repeat.set(6, 6);
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.rotation.x = 3 * Math.PI / 2;
        // this.position.z = -10;
        this.position.y = 0.01;
        this.rotation.z = Math.PI / 4;
    }
}

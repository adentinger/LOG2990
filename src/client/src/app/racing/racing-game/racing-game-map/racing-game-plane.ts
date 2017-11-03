import * as THREE from 'three';
import { Track } from '../../track';
import { PhysicMesh } from '../physic/object';

export class RacingGamePlane extends PhysicMesh {
    public static textureLoader = new THREE.TextureLoader();

    public readonly velocity = new THREE.Vector3();

    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry(Track.WIDTH_MAX, Track.HEIGHT_MAX);
        const texture = RacingGamePlane.textureLoader.load('/assets/racing/textures/grass.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(Track.WIDTH_MAX, Track.HEIGHT_MAX);
        this.material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide, shininess: 0 });
        this.rotateX(Math.PI / 2);
        this.receiveShadow = true;

        const wireframePlane = new THREE.Mesh(new THREE.PlaneGeometry(Track.WIDTH_MAX, Track.HEIGHT_MAX),
            new THREE.MeshDepthMaterial({wireframe: true}));
        this.add(wireframePlane);
    }
}

import * as THREE from 'three';
import { Track } from '../../track';
import { IPhysicElement, PhysicMesh } from '../physic/object';

export class RacingGamePlane extends PhysicMesh {
    public static textureLoader = new THREE.TextureLoader();

    public readonly children: IPhysicElement[];
    public readonly velocity = new THREE.Vector3();

    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry(Track.WIDTH_MAX, Track.HEIGHT_MAX);
        const texture = RacingGamePlane.textureLoader.load('/assets/racing/textures/grass.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(500, 500);
        this.material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide, specular: 0 });
        this.rotateX(Math.PI / 2);

        const wireframePlane = new THREE.Mesh(new THREE.PlaneGeometry(Track.WIDTH_MAX, Track.HEIGHT_MAX),
            new THREE.MeshDepthMaterial({wireframe: true}));
        this.add(wireframePlane);
    }
}

import * as THREE from 'three';
import { Track } from '../../track';
import { IPhysicElement } from '../physic/object';
import { CollidableMesh } from '../physic/collidable';

export class RacingGamePlane extends CollidableMesh {
    public static textureLoader = new THREE.TextureLoader();

    public readonly children: IPhysicElement[];
    public readonly velocity = new THREE.Vector3();

    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry(Track.WIDTH_MAX, Track.HEIGHT_MAX, 100, 100);
        const texture = RacingGamePlane.textureLoader.load('/assets/racing/textures/grass.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(500, 500);
        this.material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide, specular: 0 });
        this.rotateX(Math.PI / 2);
    }
}

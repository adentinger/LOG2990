import * as THREE from 'three';
import { Track } from '../../track';
import { PhysicMesh } from '../physic/object';
import { loadTexture } from '../../../util/textures';

export class RacingGamePlane extends PhysicMesh {
    private static readonly GRASS_URL = '/assets/racing/textures/grass.png';

    private static readonly GRASS_TEXTURE_PROMISE = loadTexture(RacingGamePlane.GRASS_URL);

    public readonly velocity = new THREE.Vector3();
    public readonly waitToLoad: Promise<void>;

    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry(Track.WIDTH_MAX, Track.HEIGHT_MAX);
        this.waitToLoad = Promise.all([
            RacingGamePlane.GRASS_TEXTURE_PROMISE
        ]).then(([texture]) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(Track.WIDTH_MAX, Track.HEIGHT_MAX);

            this.material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.FrontSide,
                shininess: 1
            });
        }).then(() => {});
        this.rotateX(-Math.PI / 2);
        this.receiveShadow = true;
    }
}

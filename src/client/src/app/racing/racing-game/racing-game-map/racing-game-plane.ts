import * as THREE from 'three';
import { Track } from '../../track';
import { PhysicMesh } from '../physic/object';

export class RacingGamePlane extends PhysicMesh {
    private static readonly GRASS_URL = '/assets/racing/textures/grass.png';
    private static readonly TEXTURE_LOADER = new THREE.TextureLoader();
    private static readonly GRASS_TEXTURE_PROMISE = RacingGamePlane.loadTexture(RacingGamePlane.GRASS_URL);

    public readonly velocity = new THREE.Vector3();
    public readonly waitToLoad: Promise<void> = RacingGamePlane.GRASS_TEXTURE_PROMISE.then(() => {});

    private static loadTexture(url: string): Promise<THREE.Texture> {
        return new Promise<THREE.Texture>((resolve, reject) => {
            const texture = RacingGamePlane.TEXTURE_LOADER.load(url,
                () => resolve(texture),
                () => {},
                reject
            );
        });
    }

    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry(Track.WIDTH_MAX, Track.HEIGHT_MAX);
        RacingGamePlane.GRASS_TEXTURE_PROMISE.then((texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(Track.WIDTH_MAX, Track.HEIGHT_MAX);
            this.material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide, shininess: 0 });
        });
        this.rotateX(-Math.PI / 2);
        this.receiveShadow = true;
    }
}

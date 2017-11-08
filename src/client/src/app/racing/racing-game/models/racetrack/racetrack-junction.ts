import * as THREE from 'three';
import { CollidableMesh } from '../../physic/collidable';
import { Track } from '../../../track';

export class RacetrackJunction extends THREE.Mesh {
    private static ASPHALT_URL = 'assets/racing/textures/ground_asphalt_old_07.png';
    private static TEXTURE_LOADER = new THREE.TextureLoader();
    private static ASPHALT_TEXTURE_PROMISE: Promise<THREE.Texture> = RacetrackJunction.loadTexture(RacetrackJunction.ASPHALT_URL);

    public static mass = 0;

    private static readonly RADIUS = Track.SEGMENT_WIDTH / 2;
    private static readonly SEGMENTS = 50;

    public readonly waitToLoad: Promise<void> = RacetrackJunction.ASPHALT_TEXTURE_PROMISE.then(() => {});

    private static loadTexture(url: string): Promise<THREE.Texture> {
        return new Promise<THREE.Texture>((resolve, reject) => {
            const texture = RacetrackJunction.TEXTURE_LOADER.load(url,
                () => resolve(texture),
                () => {},
                reject
            );
        });
    }

    constructor() {
        super(new THREE.CircleGeometry(RacetrackJunction.RADIUS, RacetrackJunction.SEGMENTS));
        this.material = new THREE.MeshPhongMaterial({side: THREE.FrontSide, shininess: 0.5});
        RacetrackJunction.ASPHALT_TEXTURE_PROMISE.then((texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(6, 6);
            (<THREE.MeshPhongMaterial>this.material).map = texture;
        });
        this.rotation.x = -Math.PI / 2;
        this.position.add(new THREE.Vector3(0, 0.01, 0));
    }
}

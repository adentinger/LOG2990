import * as THREE from 'three';
import { Track } from '../../../track';

export class RacetrackJunction extends THREE.Mesh {
    private static ASPHALT_URL = 'assets/racing/textures/ground_asphalt_old_07.png';
    private static ASPHALT_NORMALS_URL = 'assets/racing/normals/road_normal_map.jpg';
    private static TEXTURE_LOADER = new THREE.TextureLoader();
    private static ASPHALT_TEXTURE_PROMISE: Promise<THREE.Texture> = RacetrackJunction.loadTexture(RacetrackJunction.ASPHALT_URL);
    private static ASPHALT_NORMALS_PROMISE: Promise<THREE.Texture> = RacetrackJunction.loadTexture(RacetrackJunction.ASPHALT_NORMALS_URL);

    private static readonly RADIUS = Track.SEGMENT_WIDTH / 2;
    private static readonly SEGMENTS = 50;

    public mass = 0;

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
        this.material = new THREE.MeshPhongMaterial({side: THREE.FrontSide, shininess: 100});
        Promise.all([
            RacetrackJunction.ASPHALT_TEXTURE_PROMISE,
            RacetrackJunction.ASPHALT_NORMALS_PROMISE
        ]).then(([texture, normalMap]) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(Track.SEGMENT_WIDTH, Track.SEGMENT_WIDTH);
            normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
            normalMap.repeat.set(Track.SEGMENT_WIDTH, Track.SEGMENT_WIDTH);

            (<THREE.MeshPhongMaterial>this.material).map = texture;
            (<THREE.MeshPhongMaterial>this.material).normalMap = normalMap;
            (<THREE.MeshPhongMaterial>this.material).bumpMap = normalMap;
            (<THREE.MeshPhongMaterial>this.material).bumpScale = 5;
        });
        this.rotation.x = -Math.PI / 2;
        this.position.add(new THREE.Vector3(0, 0.01, 0));
    }
}

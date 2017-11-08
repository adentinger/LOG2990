import * as THREE from 'three';
import { Track } from '../../../track';

export class RacetrackSegment extends THREE.Mesh {
    private static ASPHALT_URL = 'assets/racing/textures/ground_asphalt_old_07.png';
    private static ASPHALT_NORMALS_URL = 'assets/racing/normals/road_normal_map.jpg';
    private static TEXTURE_LOADER = new THREE.TextureLoader();
    private static ASPHALT_TEXTURE_PROMISE: Promise<THREE.Texture> = RacetrackSegment.loadTexture(RacetrackSegment.ASPHALT_URL);
    private static ASPHALT_NORMALS_PROMISE: Promise<THREE.Texture> = RacetrackSegment.loadTexture(RacetrackSegment.ASPHALT_NORMALS_URL);

    public readonly mass = 0;

    public readonly length;
    public readonly waitToLoad: Promise<void> = RacetrackSegment.ASPHALT_TEXTURE_PROMISE.then(() => {});

    private static loadTexture(url: string): Promise<THREE.Texture> {
        return new Promise<THREE.Texture>((resolve, reject) => {
            const texture = RacetrackSegment.TEXTURE_LOADER.load(url,
                () => resolve(texture),
                () => {},
                reject
            );
        });
    }

    constructor(segmentLength: number) {
        super(new THREE.PlaneBufferGeometry(Track.SEGMENT_WIDTH, segmentLength));
        this.material = new THREE.MeshPhongMaterial({side: THREE.FrontSide, shininess: 100});
        Promise.all([
            RacetrackSegment.ASPHALT_TEXTURE_PROMISE,
            RacetrackSegment.ASPHALT_NORMALS_PROMISE
        ]).then(([texture, normalMap]) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(Track.SEGMENT_WIDTH, segmentLength);
            normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
            normalMap.repeat.set(Track.SEGMENT_WIDTH, segmentLength);

            (<THREE.MeshPhongMaterial>this.material).map = texture;
            (<THREE.MeshPhongMaterial>this.material).normalMap = normalMap;
            (<THREE.MeshPhongMaterial>this.material).bumpMap = normalMap;
            (<THREE.MeshPhongMaterial>this.material).bumpScale = 5;
        });
        this.rotation.x = 3 * Math.PI / 2;
        this.position.add(new THREE.Vector3(0, 0.02, 0)); // segment must be on top to support other textures

        this.length = segmentLength;
    }
}

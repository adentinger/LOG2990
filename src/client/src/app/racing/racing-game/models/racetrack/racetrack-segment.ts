import * as THREE from 'three';
import { Track } from '../../../track';

export class RacetrackSegment extends THREE.Mesh {
    private static ASPHALT_URL = 'assets/racing/textures/ground_asphalt_old_07.png';
    private static TEXTURE_LOADER = new THREE.TextureLoader();
    private static ASPHALT_TEXTURE_PROMISE: Promise<THREE.Texture> = RacetrackSegment.loadTexture(RacetrackSegment.ASPHALT_URL);

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
        this.material = new THREE.MeshPhongMaterial({side: THREE.FrontSide, shininess: 0.5});
        RacetrackSegment.ASPHALT_TEXTURE_PROMISE.then((texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(6, segmentLength);
            (<THREE.MeshPhongMaterial>this.material).map = texture;
        });
        this.rotation.x = 3 * Math.PI / 2;
        this.position.add(new THREE.Vector3(0, 0.02, 0)); // segment must be on top to support other textures

        this.length = segmentLength;
    }
}

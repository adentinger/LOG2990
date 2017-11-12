import * as THREE from 'three';
import { Track } from '../../../track';
import { loadTexture } from '../../../../util/textures';
import { Point } from '../../../../../../../common/src/math/point';

export class RacetrackSegment extends THREE.Mesh {
    private static ASPHALT_URL = 'assets/racing/textures/ground_asphalt_old_07.png';
    private static ASPHALT_NORMALS_URL = 'assets/racing/normals/road_normal_map.jpg';

    private static ASPHALT_TEXTURE_PROMISE: Promise<THREE.Texture> = loadTexture(RacetrackSegment.ASPHALT_URL);
    private static ASPHALT_NORMALS_PROMISE: Promise<THREE.Texture> = loadTexture(RacetrackSegment.ASPHALT_NORMALS_URL);

    public readonly mass = 0;

    public readonly waitToLoad: Promise<void>;

    constructor(private readonly length: number, position: Point, angle: number) {
        super(new THREE.PlaneGeometry(Track.SEGMENT_WIDTH, length).rotateX(3 * Math.PI / 2));
        this.material = new THREE.MeshPhongMaterial({side: THREE.FrontSide, shininess: 1000});
        this.waitToLoad = Promise.all([
            RacetrackSegment.ASPHALT_TEXTURE_PROMISE,
            RacetrackSegment.ASPHALT_NORMALS_PROMISE
        ]).then((textures) =>
            textures.map((texture) => texture.clone())
                .map((texture) => {
                    texture.needsUpdate = true;
                    return texture;
                })
            ).then(([texture, normalMap]) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(Track.SEGMENT_WIDTH, length);
                normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
                normalMap.repeat.set(Track.SEGMENT_WIDTH, length);

                (<THREE.MeshPhongMaterial>this.material).map = texture;
                (<THREE.MeshPhongMaterial>this.material).normalMap = normalMap;
                (<THREE.MeshPhongMaterial>this.material).bumpMap = normalMap;
                (<THREE.MeshPhongMaterial>this.material).bumpScale = 5;
            }).then(() => { });
        this.position.setY(0.015); // segment must be on top to support other textures
    }

}

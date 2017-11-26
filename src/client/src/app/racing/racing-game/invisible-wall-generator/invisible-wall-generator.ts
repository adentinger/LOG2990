import * as THREE from 'three';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { InvisibleWall } from '../models/invisible-wall/invisible-wall';
import { Track } from '../../track';
import { Tree } from '../models/decoration/tree';
import { Building } from '../models/decoration/building';
import { Vector } from '../../../../../../common/src/math/vector';

const segmentTranslation = Track.SEGMENT_WIDTH / 2;

enum TrackSide {
    LEFT = 1,
    RIGHT = -1
}

export class InvisibleWallsGenerator {

    public invisibleWalls: InvisibleWall[] = [];

    public placeInvisibleWallOnBothSideOfMap(map: RenderableMap): void {
        this.placeInvisibleWallOnASideOfMap(map, TrackSide.LEFT);
        // this.placeInvisibleWallOnASideOfMap(map, TrackSide.RIGHT);
        this.wallsIntersection(map);
    }

    private placeInvisibleWallOnASideOfMap(map: RenderableMap, trackSide: TrackSide): void {
        const lines = map.mapLines;

        for (const line of lines) {
            const invisibleWallLength = line.translation.norm();
            const invisibleWall = new InvisibleWall(invisibleWallLength);
            const angle = new THREE.Vector2(line.translation.y, line.translation.x).angle();
            const middlePoint = line.interpolate(0.5);
            invisibleWall.position.set(middlePoint.x, invisibleWall.position.y, middlePoint.y);
            invisibleWall.geometry.translate(0, 0, segmentTranslation * trackSide);
            invisibleWall.rotateY(angle + Math.PI / 2);
            this.invisibleWalls.push(invisibleWall);
            map.add(invisibleWall);
        }
    }

    private wallsIntersection(map: RenderableMap): void {
        const box1 = new THREE.Box3().setFromObject(this.invisibleWalls[0]);
        const tree = new Building();
        const tree1 = new Building();
        tree.position.set(box1.min.x, box1.min.y, box1.min.z);
        tree1.position.set(box1.max.x, box1.max.y, box1.max.z);
        map.add(tree);
        map.add(tree1);


        const box2 = new THREE.Box3().setFromObject(this.invisibleWalls[1]);
        const tree2 = new Building();
        const tree3 = new Building();
        tree2.position.set(box2.min.x, box2.min.y, box2.min.z);
        tree3.position.set(box2.max.x, box2.max.y, box2.max.z);
        map.add(tree2);
        map.add(tree3);

        const box3 = new THREE.Box3().setFromObject(this.invisibleWalls[2]);

        const tree4 = new Building();
        const tree5 = new Building();
        tree4.position.set(box3.min.x, box3.min.y, box3.min.z);
        tree5.position.set(box3.max.x, box3.max.y, box3.max.z);
        map.add(tree4);
        map.add(tree5);

        const infinityPos = new THREE.Vector3(Infinity, Infinity, Infinity);
        const infinityNeg = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
        const vector = new THREE.Box3(infinityPos, infinityNeg);
        if (!box1.intersect(box2).equals(vector)) {
            console.log(box1.intersect(box2), 'true');
        }
        else {
            console.log('false');
        }
    }

}

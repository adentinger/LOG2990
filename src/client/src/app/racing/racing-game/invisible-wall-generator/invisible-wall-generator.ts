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
        this.placeInvisibleWallOnASideOfMap(map, TrackSide.RIGHT);
         this.place(map);
    }

    private placeInvisibleWallOnASideOfMap(map: RenderableMap, trackSide: TrackSide): void {
        const lines = map.mapLines;

        for (const line of lines) {
            const invisibleWallLength = line.translation.norm();
            const invisibleWall = new InvisibleWall(invisibleWallLength);
            const angle = -(new THREE.Vector2(line.translation.x, line.translation.y).angle());
            const middlePoint = line.interpolate(0.5);
            invisibleWall.position.set(middlePoint.x, invisibleWall.position.y, middlePoint.y);
            invisibleWall.geometry.translate(0, 0, segmentTranslation * trackSide);
            invisibleWall.rotateY(angle);
            this.invisibleWalls.push(invisibleWall);
            map.add(invisibleWall);
         }
    }

    private place (map: RenderableMap) {
        this.invisibleWalls.forEach(
            wall => {
                const box1 = new THREE.Box3().setFromObject(wall);
                const tree = new Building();
                const tree1 = new Building();
                tree.position.set(box1.min.x, box1.min.y, box1.min.z);
                tree1.position.set(box1.max.x, box1.max.y, box1.max.z);
                map.add(tree);
                map.add(tree1);
            }
        );
    }
}

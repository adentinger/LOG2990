import * as THREE from 'three';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { InvisibleWall } from '../models/invisible-wall/invisible-wall';
import { Track } from '../../track';

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
        this.wallsIntersection();
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
            invisibleWall.rotation.y = angle + Math.PI / 2;
            this.invisibleWalls.push(invisibleWall);
            map.add(invisibleWall);
        }
    }

    private wallsIntersection(): void {
        const box1 = new THREE.Box3().setFromObject(this.invisibleWalls[0]);
        const box2 = new THREE.Box3().setFromObject(this.invisibleWalls[2]);
        const box3 = box1.intersect(box2);
        if (box3) {
            console.log(box3, 'true');
        }
        else {
            console.log('false');
        }
    }

}

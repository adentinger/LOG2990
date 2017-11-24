import * as THREE from 'three';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { InvisibleWall } from '../models/invisible-wall/invisible-wall';
import { Track } from '../../track';

const segmentTranslation = Track.SEGMENT_WIDTH / 2;

export class InvisibleWallsGenerator {

    public placeInvisibleWallsOnMap(map: RenderableMap): void {
        const lines = map.mapLines;

        for (const line of lines) {
            const segmentLength = line.translation.norm();
            const segment = new InvisibleWall(segmentLength);
            const angle = new THREE.Vector2(line.translation.y, line.translation.x).angle();
            const middlePoint = line.interpolate(0.5);
            segment.position.set(middlePoint.x, segment.position.y, middlePoint.y);
            segment.geometry.translate(0, 0, segmentTranslation);
            segment.rotation.y = angle + Math.PI / 2;

            map.add(segment);
        }

        for (const line of lines) {
            const segmentLength = line.translation.norm();
            const segment = new InvisibleWall(segmentLength);
            const angle = new THREE.Vector2(line.translation.y, line.translation.x).angle();
            const middlePoint = line.interpolate(0.5);
            segment.position.set(middlePoint.x, segment.position.y, middlePoint.y);
            segment.geometry.translate(0, 0, -segmentTranslation);
            segment.rotation.y = angle + Math.PI / 2;

            map.add(segment);
        }
    }
}

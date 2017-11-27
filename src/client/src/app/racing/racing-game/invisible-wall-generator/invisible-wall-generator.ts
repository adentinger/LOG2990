import * as THREE from 'three';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { InvisibleWall } from '../models/invisible-wall/invisible-wall';
import { Track } from '../../track';
import { Tree } from '../models/decoration/tree';
import { Building } from '../models/decoration/building';
import { Vector } from '../../../../../../common/src/math/vector';
import { Line } from '../../../../../../common/src/math/index';

const segmentTranslation = Track.SEGMENT_WIDTH / 2;

enum TrackSide {
    LEFT = 1,
    RIGHT = -1
}

export class InvisibleWallsGenerator {

    private invisibleWalls: InvisibleWall[] = [];
    private wallsLength: number[] = [];

    constructor(private readonly map: RenderableMap) {

    }

    public placeInvisibleWallOnBothSideOfMap(): void {
        this.placeInvisibleWallOnASideOfMap(TrackSide.LEFT);
        this.placeInvisibleWallOnASideOfMap(TrackSide.RIGHT);
    }

    private calculateWallPosition() {

    }

    private placeInvisibleWallOnASideOfMap(trackSide: TrackSide): void {
        const lines = this.map.mapLines;

        for (const line of lines) {
            const invisibleWallLength = line.translation.norm() / 2;
            const firstInvisibleWall = new InvisibleWall(invisibleWallLength, line);
            const secondInvisibleWall = new InvisibleWall(invisibleWallLength, line);
            const angle = -(new THREE.Vector2(line.translation.x, line.translation.y).angle());
            firstInvisibleWall.rotateY(angle);
            firstInvisibleWall.geometry.translate(0, 0, segmentTranslation * trackSide);
            secondInvisibleWall.rotateY(angle);
            secondInvisibleWall.geometry.translate(0, 0, segmentTranslation * trackSide);
            this.map.add(firstInvisibleWall);
            this.map.add(secondInvisibleWall);
         }
    }

    private calculateAbsoluteAngle(line: Line): number {
        return new THREE.Vector2(line.translation.y, line.translation.x).angle();
    }

    private calculateRelativeAngle(firstAbsoluteAngle: number, secondAbsoluteAngle: number): number {
        return secondAbsoluteAngle - firstAbsoluteAngle;
    }

    private normalizeAngle(angle: number): number {
        return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
    }

    private calculateAlphaAngle(normalizeAngle: number): number {
        return Math.PI - normalizeAngle;
    }

    private calculateWallIntersectionAjustment(trackWidth: number, alphaAngle): number {
        return (trackWidth / 2) * Math.tan(alphaAngle / 2);
    }

    private calculateWallLength(lineLength: number, ajustment: number): void {
        const lines = this.map.mapLines;
        for (let i = 0 ; i < lines.length - 1; i++) {
            const firstAbsoluteAngle = this.calculateAbsoluteAngle(lines[i]);
            const secondAbsoluteAngle = this.calculateAbsoluteAngle(lines[i + 1]);
            const relativeAngle = this.calculateRelativeAngle(firstAbsoluteAngle, secondAbsoluteAngle);
            const normalizeAngle = this.normalizeAngle(relativeAngle);
            const alphaAngle = this.calculateAlphaAngle(normalizeAngle);
            const wallIntersectionAjustment = this.calculateWallIntersectionAjustment(segmentTranslation, alphaAngle);
            this.wallsLength.push(wallIntersectionAjustment);
        }
    }

}

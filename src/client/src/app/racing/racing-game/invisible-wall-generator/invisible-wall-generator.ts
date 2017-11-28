import * as THREE from 'three';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { InvisibleWall } from '../models/invisible-wall/invisible-wall';
import { Track } from '../../track';
import { Tree } from '../models/decoration/tree';
import { Building } from '../models/decoration/building';
import { Vector } from '../../../../../../common/src/math/vector';
import { Line, Point } from '../../../../../../common/src/math/index';

const segmentTranslation = Track.SEGMENT_WIDTH / 2;

enum TrackSide {
    LEFT = -1,
    RIGHT = 1
}

export class InvisibleWallsGenerator {

    constructor(private readonly map: RenderableMap) {

    }

    public placeInvisibleWallOnBothSideOfMap(): void {
        this.placeInvisibleWallOnASideOfMap(TrackSide.LEFT);
        this.placeInvisibleWallOnASideOfMap(TrackSide.RIGHT);
    }

    private placeInvisibleWallOnASideOfMap(trackSide: TrackSide): void {
        const lines = this.map.mapLines;
        for (let i = 0; i < lines.length; i++) {
            const wallLengthToSubstract = this.calculateWallLengthToSubstract(i);
            const invisibleWallLength = (lines[i].translation.norm() / 2) + trackSide * wallLengthToSubstract;
            const secondInvisibleWall = new InvisibleWall(invisibleWallLength, lines[i]);
            const angle = -(new THREE.Vector2(lines[i].translation.x, lines[i].translation.y).angle());
            const middlePoint = lines[i].interpolate(0.75 + trackSide * wallLengthToSubstract / ( 2 * lines[i].translation.norm()));
            secondInvisibleWall.position.set(middlePoint.x, secondInvisibleWall.position.y, middlePoint.y);
            secondInvisibleWall.rotateY(angle);
            secondInvisibleWall.geometry.translate(0, 0, segmentTranslation * trackSide);
            this.map.add(secondInvisibleWall);
        }

        for (let i = 0; i < lines.length; i++) {
            const wallLengthToSubstract = this.calculateWallLengthToSubstract2(i);
            const invisibleWallLength = (lines[i].translation.norm() / 2) + trackSide * wallLengthToSubstract;
            const firstInvisibleWall = new InvisibleWall(invisibleWallLength, lines[i]);
            const angle = -(new THREE.Vector2(lines[i].translation.x, lines[i].translation.y).angle());
            const middlePoint = lines[i].interpolate(0.25 - trackSide * wallLengthToSubstract / ( 2 * lines[i].translation.norm()));
            firstInvisibleWall.position.set(middlePoint.x, firstInvisibleWall.position.y, middlePoint.y);
            firstInvisibleWall.rotateY(angle);
            firstInvisibleWall.geometry.translate(0, 0, segmentTranslation * trackSide);
            this.map.add(firstInvisibleWall);
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

    private calculateAlphaAngle(angle: number): number {
        return this.normalizeAngle(Math.PI - angle);
    }

    private calculateWallIntersectionAjustment(trackWidth: number, alphaAngle): number {
        return (trackWidth / 2) / Math.tan(alphaAngle / 2);
    }

    private calculateWallLengthToSubstract(i: number): number {
        const lines = this.map.mapLines;
        const firstAbsoluteAngle = this.calculateAbsoluteAngle(lines[i]);
        const secondAbsoluteAngle = this.calculateAbsoluteAngle(lines[(i + 1) % lines.length]);
        const relativeAngle = this.calculateRelativeAngle(firstAbsoluteAngle, secondAbsoluteAngle);
        const alphaAngle = this.calculateAlphaAngle(relativeAngle);
        return this.calculateWallIntersectionAjustment(Track.SEGMENT_WIDTH, alphaAngle);
    }

    private calculateWallLengthToSubstract2(i: number): number {
        const lines = this.map.mapLines;

        let firstAbsoluteAngle = 0;
        let secondAbsoluteAngle = 0;

        if (i === 0) {
            firstAbsoluteAngle = this.calculateAbsoluteAngle(lines[lines.length - 1]);
            secondAbsoluteAngle = this.calculateAbsoluteAngle(lines[(i) % lines.length]);
        }

        if (i > 0) {
            firstAbsoluteAngle = this.calculateAbsoluteAngle(lines[i - 1]);
            secondAbsoluteAngle = this.calculateAbsoluteAngle(lines[(i) % lines.length]);
        }
            const relativeAngle = this.calculateRelativeAngle(firstAbsoluteAngle, secondAbsoluteAngle);
            const alphaAngle = this.calculateAlphaAngle(relativeAngle);
            return this.calculateWallIntersectionAjustment(Track.SEGMENT_WIDTH, alphaAngle);
    }

}

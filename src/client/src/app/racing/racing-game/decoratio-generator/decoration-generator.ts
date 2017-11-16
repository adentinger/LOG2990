import * as THREE from 'three';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { Tree } from '../models/decoration/tree';
import { Building } from '../models/decoration/building';
import { Point } from '../../../../../../common/src/math/index';
import { Vector3 } from 'three';

export class DecorationGenerator {

    private static readonly ACCEPTABLE_RADIUS = 10;
    private static readonly CERCLE_RADIAN = 2 * Math.PI;
    private mapPointsIntervalCoordinate: THREE.Vector3[];
    private finalPoints: THREE.Vector3[];


    constructor() {
        this.mapPointsIntervalCoordinate = [];
        this.finalPoints = [];
    }

    public placeDecorationOnMap(map: RenderableMap): void {
        const mapLenght = map.computeLength();
        const numberOfPoints = Math.floor(mapLenght / (DecorationGenerator.ACCEPTABLE_RADIUS * 2));

        for (let i = 0 ; i < numberOfPoints; i++) {
            const interval = (i + 1) * 10;
            this.mapPointsIntervalCoordinate.push(this.generateCoordinatePosition(interval, map));
        }
        this.mapPointsIntervalCoordinate.forEach((point) => {const coordinate = this.generateCoordinate();
            this.finalPoints.push(point.addVectors(point, coordinate)); });
        this.finalPoints.forEach((point) => {const tree = new Tree; tree.position.copy(point); map.add(tree); });


    }

    private verifySuperposedItem(): void {
        return null;
    }

    private verifyItemIsOutsideTrack(): void {
        return null;
    }

    private placeTree(): void {
        return null;
    }

    private placeBuilding(): void {
        return null;
    }

    private generateCoordinatePosition(interval: number, map: RenderableMap): THREE.Vector3 {
        const lines = map.mapLines;
        for (const line of lines) {
            if (interval > line.translation.norm()) {
                interval -= line.translation.norm();
            } else {
                const point = line.interpollate(interval / line.translation.norm());
                return new THREE.Vector3(point.x, 0.03, point.y);
            }
        }
        return null;
    }

    private generateRandomRadius(): number {

        return Math.floor(Math.random() * DecorationGenerator.ACCEPTABLE_RADIUS * 2 - DecorationGenerator.ACCEPTABLE_RADIUS);
    }

    private generateRandomAngle(): number {
        return Math.random() * DecorationGenerator.CERCLE_RADIAN;
    }

    private generateCoordinate(): THREE.Vector3 {
        const randomRadius = this.generateRandomRadius();
        const randomTheta = this.generateRandomAngle();
        return new THREE.Vector3(randomRadius * Math.cos(randomTheta), 0.03, randomRadius * Math.sin(randomTheta));
    }
}

import * as THREE from 'three';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { Tree } from '../models/decoration/tree';
import { Building } from '../models/decoration/building';
import { Point, Vector } from '../../../../../../common/src/math/index';
import { Vector3 } from 'three';
import { CollidableMesh } from '../physic/collidable';
import { DecorationFactory } from './decoration-factory';
import { Line } from '../../../../../../common/src/math/line';
import { MapPositionAlgorithms } from '../../../util/map-position-algorithms';
import { Projection } from '../../../util/projection';

export enum DecorationEnum {
    Tree,
    Bush,
    Building
}

export class DecorationGenerator {

    private static readonly ACCEPTABLE_RADIUS = 30;
    private static readonly CERCLE_RADIAN = 2 * Math.PI;
    private mapPointsIntervalCoordinate: THREE.Vector3[];
    private finalPoints: THREE.Vector3[];
    private finalDecorations: CollidableMesh[];
    private intervalPointsWithLine: [THREE.Vector3, Line][];


    constructor() {
        this.mapPointsIntervalCoordinate = [];
        this.finalPoints = [];
        this.finalDecorations = [];
        this.intervalPointsWithLine = [];
    }

    public placeDecorationOnMap(map: RenderableMap): void {
        const mapLenght = map.computeLength();
        const numberOfPoints = Math.floor(mapLenght / (DecorationGenerator.ACCEPTABLE_RADIUS * 2));

        for (let i = 1 ; i <= numberOfPoints; i++) {
            const interval = i * (DecorationGenerator.ACCEPTABLE_RADIUS * 2);
            this.mapPointsIntervalCoordinate.push(this.generateCoordinatePositionMap(interval, map));
        }

        this.mapPointsIntervalCoordinate.forEach((point) => {
            let coordinate: Vector3 = new THREE.Vector3(0, 0, 0);
            const finalPoint: Vector3 = new THREE.Vector3(0, 0, 0);
            do {
                coordinate = this.generateCoordinatePositionRadius();
                finalPoint.addVectors(point, coordinate);
            } while (this.isSuperposedItem(finalPoint, map) || this.isOnTrack(finalPoint, map));
            const decoration = this.generateRandomDecoration();
            decoration.position.copy(finalPoint);
            this.finalDecorations.push(decoration);
        });

        this.finalDecorations.forEach((decoration) => {map.add(decoration); });
    }

    private isSuperposedItem(point: Vector3, map: RenderableMap): boolean {
        console.log("isSuperposedItem");
        this.finalDecorations.forEach(
            (decoration) => {
                decoration.geometry.computeBoundingBox();
                if ((point.x < decoration.geometry.boundingBox.min.x || point.x > decoration.geometry.boundingBox.max.x)
                && (point.z < decoration.geometry.boundingBox.min.z || point.z > decoration.geometry.boundingBox.max.z)) {
                    return true;
                }
            }
        );
        return false;
    }

    private isOnTrack(point: THREE.Vector3, map: RenderableMap): boolean {
        console.log("isOnTrack");
        const lines = map.mapLines;
        const pointe = new Point(point.x, point.z);
        let pointNorm = pointe.distanceTo(map.mapPoints[0]);
        for (const line of lines) {
            if (pointNorm > line.translation.norm()) {
                pointNorm -= line.translation.norm();
            } else {
                console.log(pointe, pointNorm, line);
                const projection: Projection = MapPositionAlgorithms.getProjectionOnLine(pointe, line);
                if (projection.distanceToSegment <= 5) {
                    return true;
                }
            }
        }
        return false;
    }

    private generateCoordinatePositionMap(interval: number, map: RenderableMap): THREE.Vector3 {
        const lines = map.mapLines;
        for (const line of lines) {
            if (interval > line.translation.norm()) {
                interval -= line.translation.norm();
            } else {
                const point = line.interpollate(interval / line.translation.norm());
                const pointOnMap = new THREE.Vector3(Math.round(point.x), 0.03, Math.round(point.y));
                return pointOnMap;
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

    private generateCoordinatePositionRadius(): THREE.Vector3 {
        const randomRadius = this.generateRandomRadius();
        const randomTheta = this.generateRandomAngle();
        return new THREE.Vector3(Math.round(randomRadius * Math.cos(randomTheta)), 0.03, Math.round(randomRadius * Math.sin(randomTheta)));
    }

    private generateRandomDecoration(): CollidableMesh {
        const randomIndex = Math.round(Math.random() * 2);
        const randomClassName = DecorationEnum[randomIndex];
        const decorationFactory = new DecorationFactory();
        return decorationFactory.getClassInstance(randomClassName);
    }
}

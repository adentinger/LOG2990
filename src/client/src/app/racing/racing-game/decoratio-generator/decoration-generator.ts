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
import { Decoration } from '../models/decoration/decoration';

export enum DecorationType {
    TREE,
    BUSH,
    BUILDING
}

export class DecorationGenerator {

    private static readonly ACCEPTABLE_RADIUS = 30;
    private static readonly CIRCLE_RADIUS_RADIAN = 2 * Math.PI;
    private mapPointsIntervalCoordinate: THREE.Vector3[];
    private finalPoints: THREE.Vector3[];
    private finalDecorations: Decoration[];
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
            let decoration: Decoration;
            for (let i = 0 ; i < 20; i++) {
                do {
                    coordinate = this.generateCoordinatePositionRadius();
                    finalPoint.addVectors(point, coordinate);
                    decoration = this.generateRandomDecoration();
                    decoration.position.copy(finalPoint);
                } while (this.isSuperposedItem(decoration) || this.isOnTrack(finalPoint, map));
                this.finalDecorations.push(decoration);
            }
        });

        this.finalDecorations.forEach((decoration) => {map.add(decoration); });
    }

    private isSuperposedItem(decoration: Decoration): boolean {
        decoration.geometry.computeBoundingBox();
        this.finalDecorations.forEach(
            (decorationOnMap) => {
                decorationOnMap.geometry.computeBoundingBox();
                if (((decoration.geometry.boundingBox.max.x + decoration.position.x)
                 >= (decorationOnMap.geometry.boundingBox.min.x + decorationOnMap.position.x) &&
                     (decorationOnMap.geometry.boundingBox.max.x + decorationOnMap.position.x) >=
                     (decoration.geometry.boundingBox.min.x + decoration.position.x))
                && ((decoration.geometry.boundingBox.max.z + decoration.position.z) >=
                 (decorationOnMap.geometry.boundingBox.min.z + decorationOnMap.position.z) &&
                    (decorationOnMap.geometry.boundingBox.max.z + decorationOnMap.position.z) >=
                     decoration.geometry.boundingBox.min.z +  + decoration.position.z)) {
                    return true;
                }
            }
        );
        return false;
    }

    private isOnTrack(point: THREE.Vector3, map: RenderableMap): boolean {
        const lines = map.mapLines;
        const coordinatePoint = new Point(point.x, point.z);
        const pointDistanceFromOrigin = coordinatePoint.distanceTo(map.mapPoints[0]);
        for (const line of lines) {
            const projection = MapPositionAlgorithms.getProjectionOnLine(coordinatePoint, line);
            if (projection.distanceToSegment < (5 + 3)) {
                return true;
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
                const point = line.interpolate(interval / line.translation.norm());
                const pointOnMap = new THREE.Vector3(Math.round(point.x), 0.03, Math.round(point.y));
                return pointOnMap;
            }
        }
        return null;
    }

    private generateRandomRadiusForPosition(): number {
        return Math.round(Math.random() * DecorationGenerator.ACCEPTABLE_RADIUS);
    }

    private generateRandomAngleForPosition(): number {
        return Math.random() * DecorationGenerator.CIRCLE_RADIUS_RADIAN;
    }

    private generateCoordinatePositionRadius(): THREE.Vector3 {
        const randomRadius = this.generateRandomRadiusForPosition();
        const randomAngle = this.generateRandomAngleForPosition();
        return new THREE.Vector3(Math.round(randomRadius * Math.cos(randomAngle)), 0.03, Math.round(randomRadius * Math.sin(randomAngle)));
    }

    private generateRandomDecoration(): Decoration {
        const numberOfDecorationType = Object.keys(DecorationType).length / 2;
        const randomIndex = Math.round(Math.random() * (numberOfDecorationType - 1));
        const randomClassName = DecorationType[randomIndex];
        const decorationFactory = new DecorationFactory();
        return decorationFactory.getClassInstance(randomClassName);
    }
}

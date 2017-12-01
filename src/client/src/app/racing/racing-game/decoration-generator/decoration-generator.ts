import * as THREE from 'three';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { Point } from '../../../../../../common/src/math/index';
import { Vector3 } from 'three';
import { DecorationFactory, DecorationType } from './decoration-factory';
import { Line } from '../../../../../../common/src/math/line';
import { MapPositionAlgorithms } from '../../../util/map-position-algorithms';
import { Projection } from '../../../util/projection';
import { Decoration } from '../models/decoration/decoration';
import { Track } from '../../track';
import { PhysicUtils } from '../physic/utils';

const MAX_TRY_COUNT = 100;

export class DecorationGenerator {

    private static readonly ACCEPTABLE_RADIUS = 25;
    private static readonly DECORATION_COUNT_PER_ZONE = 30;
    private static readonly CIRCLE_RADIUS_RADIAN = 2 * Math.PI;
    private static readonly DECORATION_FACTORY = new DecorationFactory();

    public placeDecorationsOnMap(map: RenderableMap): void {
        const mapLength = map.computeLength();
        const numberOfPoints = Math.floor(mapLength / (DecorationGenerator.ACCEPTABLE_RADIUS * 2));
        const decorations: Decoration[] = [];

        for (let intervalIndex = 0 ; intervalIndex <= numberOfPoints; intervalIndex++) {
            const interval = intervalIndex * (DecorationGenerator.ACCEPTABLE_RADIUS * 2);
            const point = this.generateCoordinatePositionMap(interval, map);
            this.placeDecorationsAround(point, map, decorations);
        }

        decorations.forEach((decoration) => {map.add(decoration); });
    }

    private placeDecorationsAround(point: THREE.Vector3, map: RenderableMap, decorations: Decoration[]): void {
        let coordinatePositionOnRadius: Vector3 = new THREE.Vector3();
        const pointOnMap: Vector3 = new THREE.Vector3();
        let decoration: Decoration;
        let tryCount = 0;
        for (let i = 0 ; i < DecorationGenerator.DECORATION_COUNT_PER_ZONE; i++) {
            do {
                coordinatePositionOnRadius = this.generateCoordinatePositionRadius();
                pointOnMap.addVectors(point, coordinatePositionOnRadius);
                decoration = this.generateRandomDecoration();
                decoration.position.copy(pointOnMap);
                decoration.rotation.y = this.generateRandomAngle();
            } while ((this.getIfDecorationSuperposed(decoration, decorations) || this.getIfOnTrack(decoration, map)) &&
                tryCount++ < MAX_TRY_COUNT);
            if (tryCount <= MAX_TRY_COUNT) {
                decorations.push(decoration);
            }
        }
    }

    private getIfDecorationSuperposed(decoration: Decoration, decorations: Decoration[]): boolean {
        const box1 = new THREE.Box3().setFromObject(decoration);
        for (const decorationOnMap of decorations) {
            const box2 = new THREE.Box3().setFromObject(decorationOnMap);
            if (box1.intersectsBox(box2)) {
                return true;
            }
        }
        return false;
    }

    private getIfOnTrack(decoration: Decoration, map: RenderableMap): boolean {
        const lines = map.mapLines;
        const coordinatePoint = new Point(decoration.position.x, decoration.position.z);
        const decorationDimensions = PhysicUtils.getObjectDimensions(decoration);
        for (const line of lines) {
            const projection = MapPositionAlgorithms.getProjectionOnLine(coordinatePoint, line);
            if (projection.distanceToSegment <= ((Track.SEGMENT_WIDTH / 2) + Math.max(decorationDimensions.x, decorationDimensions.z))) {
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
                const pointOnMap = new THREE.Vector3(point.x, 0, point.y);
                return pointOnMap;
            }
        }
        throw new Error('cannot find interval greater than map length');
    }

    private generateRandomRadiusForPosition(): number {
        return Math.random() * DecorationGenerator.ACCEPTABLE_RADIUS;
    }

    private generateRandomAngle(): number {
        return Math.random() * DecorationGenerator.CIRCLE_RADIUS_RADIAN;
    }

    private generateCoordinatePositionRadius(): THREE.Vector3 {
        const randomRadius = this.generateRandomRadiusForPosition();
        const randomAngle = this.generateRandomAngle();
        return new THREE.Vector3(randomRadius * Math.cos(randomAngle), 0, randomRadius * Math.sin(randomAngle));
    }

    private generateRandomDecoration(): Decoration {
        const numberOfDecorationType = DecorationType.COUNT - 1;
        const randomIndex = Math.floor(Math.random() * numberOfDecorationType);
        return DecorationGenerator.DECORATION_FACTORY.getClassInstance(randomIndex as DecorationType);
    }
}

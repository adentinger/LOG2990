import * as THREE from 'three';
import * as ImprovedNoise from 'improved-noise';

import { Track } from '../racing/track';
import { Line, Point } from '../../../../common/src/math/index';
import { MapPositionAlgorithms } from './map-position-algorithms';

const widthSegments  = Math.ceil( Track.WIDTH_MAX / 10);
const heightSegments = Math.ceil(Track.HEIGHT_MAX / 10);

export class TerrainGeometry extends THREE.PlaneGeometry {

    constructor(track: Line[]) {
        super(Track.WIDTH_MAX, Track.HEIGHT_MAX, widthSegments, heightSegments);

        const rawTerrainDispalcement = this.generateRawDisplacement();
        const terrainDisplacement = this.flattenTerrainNearTrack(rawTerrainDispalcement, track);

        this.vertices.forEach((vertex, index) => {
            vertex.z += terrainDisplacement[index];
        });
    }

    private generateRawDisplacement(): number[] {
        // METHOD PARTLY TAKEN FROM:
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_terrain.html

        // Copyright © 2010-2017 three.js authors (MIT License)

        const numberOfWidthVertices  = widthSegments  + 1;
        const numberOfHeightVertices = heightSegments + 1;
        const size = numberOfWidthVertices * numberOfHeightVertices;
        const terrainDisplacementUint8 = new Uint8Array(size);

        const perlin = new ImprovedNoise();
        const z = Math.random() * 100;

        let quality = 1;
        for (let j = 0; j < 4; j ++) {

            for (let i = 0; i < size; i ++) {
                const x = i % numberOfWidthVertices, y = (i / numberOfHeightVertices);
                const height = Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
                terrainDisplacementUint8[i] = height;
            }

            quality *= 5;

        }

        // Convert Uint8 buffer to number array.
        const terrainDisplacement: number[] = [];
        terrainDisplacementUint8.forEach(height => terrainDisplacement.push(Number(height)));
        return terrainDisplacement;
    }

    private flattenTerrainNearTrack(rawTerrainDisplacement: number[], track: Line[]): number[] {
        const terrainDisplacement: number[] = new Array(rawTerrainDisplacement.length);
        this.vertices.forEach((vertex, index) => {
            const position = new Point(vertex.x, vertex.z);
            const projection = MapPositionAlgorithms.getClosestProjection(position, track);
            terrainDisplacement[index] =
                this.flattenSinglePosition(rawTerrainDisplacement[index], projection.distanceToSegment);
        });
        return terrainDisplacement;
    }

    private flattenSinglePosition(rawDisplacement: number, distanceToTrack: number): number {
        // For formula, see doc/architectures/formula_displacement_factor.jpg
        const distaneMin = Track.SEGMENT_WIDTH / 2;
        const distanceAtModulation = Track.SEGMENT_WIDTH * 1.2;
        const distanceAtMax = Track.SEGMENT_WIDTH * 10;

        const factorMedium = 0.1;

        let displacementFactor: number;
        if (distanceToTrack < distaneMin) {
            displacementFactor = -0.1;
        }
        else if (distanceToTrack < distanceAtModulation) {
            displacementFactor = factorMedium;
        }
        else if (distanceToTrack < distanceAtMax) {
            displacementFactor =
                -Math.exp(-distanceToTrack + distanceAtModulation + Math.log(1 - factorMedium)) + 1;
        }
        else {
            displacementFactor = 1;
        }
        return rawDisplacement * displacementFactor;
    }

}

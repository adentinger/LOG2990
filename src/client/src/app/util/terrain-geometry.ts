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

        // The MIT License
        //
        // Copyright © 2010-2017 three.js authors
        //
        // Permission is hereby granted, free of charge, to any person obtaining a copy
        // of this software and associated documentation files (the "Software"), to deal
        // in the Software without restriction, including without limitation the rights
        // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        // copies of the Software, and to permit persons to whom the Software is
        // furnished to do so, subject to the following conditions:
        //
        // The above copyright notice and this permission notice shall be included in
        // all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        // THE SOFTWARE.

        const numberOfWidthVertices  = widthSegments  + 1;
        const numberOfHeightVertices = heightSegments + 1;
        const size = Track.WIDTH_MAX * Track.HEIGHT_MAX;
        const terrainDisplacementUint8 = new Uint8Array(size);

        const perlin = new ImprovedNoise();
        const z = Math.random() * 100;

        let quality = 1;
        for (let j = 0; j < 4; j ++) {

            for (let i = 0; i < size; i ++) {
                const x = i % widthSegments, y = (i / heightSegments);
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
        const terrainDisplacement: number[] = [];
        this.vertices.forEach((vertex, index) => {
            const position = new Point(vertex.x, vertex.z);
            const projection = MapPositionAlgorithms.getClosestProjection(position, track);
            terrainDisplacement.push(
                this.flattenSinglePosition(rawTerrainDisplacement[index], projection.distanceToSegment)
            );
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

import * as THREE from 'three';
import * as ImprovedNoise from 'improved-noise';

import { Track } from '../track';
import { Line, Point } from '../../../../../common/src/math/index';
import { MapPositionAlgorithms } from './map-position-algorithms';

/**
 * @class TerrainGeometry
 * @description Creates and contains the geometry of the racing game's
 * terrain, taking the racing track into account.
 */
export class TerrainGeometry extends THREE.PlaneGeometry {

    private static readonly terrainDisplacementMax = 50;
    private static readonly widthSegments  = Math.ceil( Track.WIDTH_MAX / 3);
    private static readonly heightSegments = Math.ceil(Track.HEIGHT_MAX / 3);

    /**
     * @argument track The track. Must be relative to the geometry's center (0, 0, 0).
     */
    constructor(track: Line[]) {
        super(Track.WIDTH_MAX, Track.HEIGHT_MAX, TerrainGeometry.widthSegments, TerrainGeometry.heightSegments);

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

        const numberOfWidthVertices  = TerrainGeometry.widthSegments  + 1;
        const numberOfHeightVertices = TerrainGeometry.heightSegments + 1;
        const size = numberOfWidthVertices * numberOfHeightVertices;
        const terrainDisplacementUint8 = new Uint8Array(size);

        const perlin = new ImprovedNoise();
        const perlinNoiseMax = 256;
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
        terrainDisplacementUint8.forEach(height => terrainDisplacement.push(Number(height) / perlinNoiseMax));
        return terrainDisplacement;
    }

    private flattenTerrainNearTrack(rawTerrainDisplacement: number[], track: Line[]): number[] {
        const terrainDisplacement: number[] = new Array(rawTerrainDisplacement.length);
        this.vertices.forEach((vertex, index) => {
            const position = new Point(vertex.x, -vertex.y);
            const projection = MapPositionAlgorithms.getClosestProjection(position, track);
            terrainDisplacement[index] =
                this.flattenSinglePosition(rawTerrainDisplacement[index], projection.distanceToSegment);
        });
        return terrainDisplacement;
    }

    private flattenSinglePosition(rawDisplacement: number, distanceToTrack: number): number {
        // For formula, see doc/architectures/formula_displacement_factor.jpg
        const distaneMin = Track.SEGMENT_WIDTH;
        const distanceAtModulation = Track.SEGMENT_WIDTH * 4;
        const distanceAtMax = Track.SEGMENT_WIDTH * 20;

        const factorMedium = 0.02;

        let displacementFactor: number;
        if (distanceToTrack < distaneMin) {
            displacementFactor = 0;
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
        return rawDisplacement * displacementFactor * TerrainGeometry.terrainDisplacementMax;
    }

}

import * as THREE from 'three';
import * as ImprovedNoise from 'improved-noise';

export class TerrainGenerator {

    private readonly terrainHeights: Uint8Array;

    constructor(width, height) {
        const size = width * height;
        this.terrainHeights = new Uint8Array(size);
        this.generateHights(width, height);
    }

    public get(index: number): number {
        return this.terrainHeights[index];
    }

    private generateHights(width, height): void {
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

        const size = width * height;

        const perlin = new ImprovedNoise();
        const z = Math.random() * 100;

        let quality = 1;
        for (let j = 0; j < 4; j ++) {

            for (let i = 0; i < width * height; i ++) {
                const x = i % width, y = (i / width);
                this.terrainHeights[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
            }

            quality *= 5;

        }
    }
}

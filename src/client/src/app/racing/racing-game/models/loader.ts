import { Injectable } from '@angular/core';
import * as THREE from 'three';

import { Logger } from '../../../../../../common/src/index';

export class Loader {

    private readonly jsonLoader = new THREE.JSONLoader();
    private readonly logger = Logger.getLogger('LoaderService');

    constructor() { }

    public load(url: string, name: string): Promise<THREE.Mesh> {
        return new Promise((resolve, reject) => {
            this.jsonLoader.load(
                url,
                (geometry, materials) => {
                    const CAR_PART = new THREE.Mesh(geometry, materials[0]);
                    CAR_PART.name = name;
                    resolve(CAR_PART);
                },
                () => { },
                (reason) => { this.logger.warn(reason); reject(reason); }
            );
        });
    }

}

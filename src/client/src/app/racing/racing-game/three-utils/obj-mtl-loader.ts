import { Injectable } from '@angular/core';
import * as THREE from 'three';

import { Logger } from '../../../../../../common/src/index';

/**
 * Loads an object (.obj) file along with a material (.mtl) file.
 */
@Injectable()
export class ObjMtlLoader {

    private objLoader: THREE.OBJLoader = new THREE.OBJLoader();
    private mtlLoader: THREE.MTLLoader = new THREE.MTLLoader();
    private logger: Logger = Logger.getLogger('ObjMtlLoader');

    constructor(basePath?: string) {
        if (basePath) {
            this.objLoader.setPath(basePath);
            this.mtlLoader.setPath(basePath);
        }
    }

    public load(objFile: string, mtlFile: string): Promise<THREE.Group> {
        return new Promise((resolve, reject) => {
            this.mtlLoader.load(
                mtlFile,
                (materialCreator) => {
                    materialCreator.preload();
                    this.objLoader.setMaterials(materialCreator);
                    this.objLoader.load(
                        objFile,
                        (model) => {
                            resolve(model);
                        },
                        () => {},
                        (reason) => {
                            this.logger.warn(reason);
                            reject(reason);
                        }
                    );
                },
                () => {},
                (reason) => {
                    this.logger.warn(reason);
                    reject(reason);
                }
            );
        });
    }

}

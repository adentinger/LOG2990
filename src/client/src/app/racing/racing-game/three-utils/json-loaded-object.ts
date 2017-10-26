import * as THREE from 'three';

import { Logger } from '../../../../../../common/src/index';

export class JsonLoadedObject {

    protected static jsonLoader = new THREE.JSONLoader();
    protected static basePath: string;
    protected static fileExtension = '.json';

    protected logger = Logger.getLogger('JsonLoadedObject');

    public load(): Promise<THREE.Mesh> {
        return new Promise((resolve, reject) => {
            JsonLoadedObject.jsonLoader.load(
                JsonLoadedObject.basePath + name + JsonLoadedObject.fileExtension,
                (geometry, materials) => {
                    const MESH = new THREE.Mesh(geometry, materials[0]);
                    resolve(MESH);
                },
                () => {},
                (reason) => this.logger.warn(reason)
            );
        });
    }

}

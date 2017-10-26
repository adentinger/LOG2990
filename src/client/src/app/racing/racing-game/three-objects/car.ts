import * as THREE from 'three';

import { ObjMtlLoader } from '../three-utils/obj-mtl-loader';
import { Logger } from '../../../../../../common/src/index';

export enum CarColor {
    RED = 0,
    YELLOW,
    GREEN,
    BLUE
}

export class Car extends THREE.Group {

    private static readonly JSON_LOADER: THREE.JSONLoader = new THREE.JSONLoader();
    private static readonly BASE_PATH = 'assets/racing/car_model/';
    private static readonly FILE_EXTENSION = '.json';

    private logger = Logger.getLogger('Car');

    constructor(carColor: CarColor) {
        super();
        const loader = new THREE.JSONLoader();
        this.addCarParts(carColor);
    }

    private async addCarParts(color: CarColor): Promise<void> {

    }

    private loadCarPart(name: string): Promise<THREE.Mesh> {
        return new Promise((resolve, reject) => {
            Car.JSON_LOADER.load(
                Car.BASE_PATH + name + Car.FILE_EXTENSION,
                (geometry, materials) => {
                    const CAR_PART = new THREE.Mesh(geometry, materials[0]);
                    console.log(CAR_PART);
                    resolve(CAR_PART);
                },
                () => {},
                (reason) => this.logger.warn(reason)
            );
        });
    }

}

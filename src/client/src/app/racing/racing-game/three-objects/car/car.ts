import * as THREE from 'three';

import { Logger } from '../../../../../../../common/src/index';
import { CarColor } from './car-color';
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
        const PART_NAMES = [
            'air_intake',
            'bottom',
            'brake_light',
            'exhaust_and_mirror',
            'lights',
            'mag',
            'plastic',
            'windows'
        ];
        for (let i = 0; i < PART_NAMES.length; ++i) {
            const PART_NAME = PART_NAMES[i];
            this.children.push(await this.loadCarPart(PART_NAME));
        }

        this.children.push(await this.loadBody(color));
    }

    private loadCarPart(name: string): Promise<THREE.Mesh> {
        return new Promise((resolve, reject) => {
            Car.JSON_LOADER.load(
                Car.BASE_PATH + name + Car.FILE_EXTENSION,
                (geometry, materials) => {
                    const CAR_PART = new THREE.Mesh(geometry, materials[0]);
                    resolve(CAR_PART);
                },
                () => {},
                (reason) => this.logger.warn(reason)
            );
        });
    }

    private loadBody(color: CarColor): Promise<THREE.Mesh> {
        return new Promise((resolve, reject) => {
            this.loadCarPart('body')
                .then((bodyMesh) => {
                    const BODY_MATERIAL = (bodyMesh.material as THREE.MeshPhongMaterial);
                    const RGB_COLOR = color.getRgb();
                    [BODY_MATERIAL.color.r, BODY_MATERIAL.color.g, BODY_MATERIAL.color.b]
                        = [RGB_COLOR.r, RGB_COLOR.g, RGB_COLOR.b];
                    resolve(bodyMesh);
                })
                .catch(() => reject());
        });
    }

}

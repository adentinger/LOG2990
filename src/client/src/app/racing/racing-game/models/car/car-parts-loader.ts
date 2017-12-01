import * as THREE from 'three';
import { Logger } from '../../../../../../../common/src';

const logger = Logger.getLogger('Car');
const JSON_LOADER: THREE.JSONLoader = new THREE.JSONLoader();

export class CarPartsLoader {
    private static readonly BASE_PATH = 'assets/racing/car_model/';
    private static readonly FILE_EXTENSION = '.json';

    private static readonly PART_NAMES = [
        'air_intake',
        'bottom',
        'brake_light',
        'brakes',
        'exhaust_and_mirror',
        'lights',
        'plastic',
        'tires',
        'windows'
    ];

    private static readonly COLORED_PART_NAMES = [
        'body'
    ];

    private static readonly SHININESS = 1000;

    // has to be public to be able to get the car's dimensions
    public static readonly CAR_PARTS: Promise<THREE.Mesh[]> = CarPartsLoader.loadCarParts(CarPartsLoader.PART_NAMES);
    public static readonly CAR_COLORED_PARTS: Promise<THREE.Mesh[]> = CarPartsLoader.loadColoredCarParts();

    private static loadCarPart(name: string): Promise<THREE.Mesh> {
        return new Promise((resolve, reject) => {
            JSON_LOADER.load(
                CarPartsLoader.BASE_PATH + name + CarPartsLoader.FILE_EXTENSION,
                (geometry, materials) => {
                    const CAR_PART = new THREE.Mesh(geometry, materials[0]);
                    CAR_PART.name = name;
                    geometry.computeVertexNormals();
                    geometry['computeMorphNormals']();
                    (materials[0] as THREE.MeshPhongMaterial).blending = THREE.NoBlending;
                    (materials[0] as THREE.MeshPhongMaterial).shininess = CarPartsLoader.SHININESS;
                    (materials[0] as THREE.MeshPhongMaterial).emissiveIntensity = 0;
                    CAR_PART.receiveShadow = true;
                    CAR_PART.castShadow = true;
                    resolve(CAR_PART);
                },
                () => { },
                (reason) => { logger.warn(reason); reject(reason); }
            );
        });
    }

    private static loadColoredCarParts(): Promise<THREE.Mesh[]> {
        const COLORED_CAR_PARTS: Promise<THREE.Mesh>[] = [];
        CarPartsLoader.COLORED_PART_NAMES.forEach((partName) => {
            COLORED_CAR_PARTS.push(
                this.loadCarPart(partName)
                    .then((bodyMesh) => {
                        const BODY_MATERIAL = (bodyMesh.material as THREE.MeshPhongMaterial);
                        BODY_MATERIAL.shininess = CarPartsLoader.SHININESS;
                        return bodyMesh;
                    })
            );
        });
        return Promise.all(COLORED_CAR_PARTS);
    }

    private static loadCarParts(partNames: string[]): Promise<THREE.Mesh[]> {
        const CAR_PARTS = [];
        for (const partName of partNames) {
            CAR_PARTS.push(this.loadCarPart(partName));
        }

        return Promise.all(CAR_PARTS);
    }
}

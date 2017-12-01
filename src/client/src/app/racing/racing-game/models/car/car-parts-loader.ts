import * as THREE from 'three';
import { Logger } from '../../../../../../../common/src';
import { Loader } from '../loader';

const logger = Logger.getLogger('Car');
const JSON_LOADER: THREE.JSONLoader = new THREE.JSONLoader();

export class CarPartsLoader {
    private static readonly BASE_PATH = 'assets/racing/car_model/';
    private static readonly FILE_EXTENSION = '.json';
    private static readonly LOADER = new Loader();

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
        return this.LOADER.load(CarPartsLoader.BASE_PATH + name + CarPartsLoader.FILE_EXTENSION, name)
                    .then(carPart => CarPartsLoader.improveMaterialPropertiesOf(carPart));
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
        return this.LOADER.loadAll(CarPartsLoader.BASE_PATH, partNames).then(
            parts => {
                parts.forEach(part => CarPartsLoader.improveMaterialPropertiesOf(part));
                return parts;
            }
        );
    }

    private static improveMaterialPropertiesOf(carPart: THREE.Mesh): THREE.Mesh {
        carPart.geometry.computeVertexNormals();
        carPart.geometry['computeMorphNormals']();
        (carPart.material as THREE.MeshPhongMaterial).blending = THREE.NoBlending;
        (carPart.material as THREE.MeshPhongMaterial).shininess = CarPartsLoader.SHININESS;
        (carPart.material as THREE.MeshPhongMaterial).emissiveIntensity = 0;
        carPart.receiveShadow = true;
        carPart.castShadow = true;
        return carPart;
    }

}

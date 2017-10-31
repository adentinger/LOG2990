import * as THREE from 'three';

import { Logger } from '../../../../../../../common/src/index';
import { CarColor } from './car-color';
import { UserControllableCollidableMesh } from '../../physic/user-controllable-collidable';

export interface CarLights {
    headlightLeft: THREE.Light;
    headlightRight: THREE.Light;
}

interface CarLightOptions {
    color: number;
    intensity: number;
    distance: number;
    angle: number;
    exponent: number;
    decay: number;
    headlightPositions: THREE.Vector3[];
}

export class Car extends UserControllableCollidableMesh {

    private static readonly JSON_LOADER: THREE.JSONLoader = new THREE.JSONLoader();
    private static readonly BASE_PATH = 'assets/racing/car_model/';
    private static readonly FILE_EXTENSION = '.json';

    private static readonly HEADLIGHT_OPTIONS: CarLightOptions = {
        color: 0xfbf2b5,
        intensity: 1,
        distance: 10,
        angle: Math.PI / 4,
        exponent: 0.6,
        decay: 1.3,
        headlightPositions: [
            new THREE.Vector3(-0.56077, 0.63412, -2.75),
            new THREE.Vector3(0.56077, 0.63412, -2.75)
        ]
    };

    private logger = Logger.getLogger('Car');
    private lights: CarLights;
    private boundingBox: THREE.Box3;
    public readonly corner1 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    public readonly corner2 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    public readonly corner3 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    public readonly corner4 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xff7f00 }));

    protected maxSpeed = 15; // m/s

    constructor(carColor: CarColor) {
        super();
        this.addLights();
        this.addCarParts(carColor).then(() => {
            this.boundingBox = new THREE.Box3().setFromObject(this);
        });
        this.boundingBox = new THREE.Box3().setFromObject(this);
    }

    private async addCarParts(color: CarColor): Promise<void> {
        const PART_NAMES = [
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
        for (let i = 0; i < PART_NAMES.length; ++i) {
            const PART_NAME = PART_NAMES[i];
            this.add(await this.loadCarPart(PART_NAME));
        }

        this.add(... await this.loadColoredCarParts(color));
    }

    private loadCarPart(name: string): Promise<THREE.Mesh> {
        return new Promise((resolve, reject) => {
            Car.JSON_LOADER.load(
                Car.BASE_PATH + name + Car.FILE_EXTENSION,
                (geometry, materials) => {
                    const CAR_PART = new THREE.Mesh(geometry, materials[0]);
                    geometry.computeVertexNormals();
                    geometry['computeMorphNormals']();
                    resolve(CAR_PART);
                },
                () => { },
                (reason) => this.logger.warn(reason)
            );
        });
    }

    private loadColoredCarParts(color: CarColor): Promise<THREE.Mesh[]> {
        const COLORED_CAR_PARTS: Promise<THREE.Mesh>[] = [];
        const COLORED_PART_NAMES = [
            'body'
        ];
        COLORED_PART_NAMES.forEach((partName) => {
            COLORED_CAR_PARTS.push(
                new Promise((resolve, reject) => {
                    this.loadCarPart(partName)
                        .then((bodyMesh) => {
                            const BODY_MATERIAL = (bodyMesh.material as THREE.MeshPhongMaterial);
                            const RGB_COLOR = color.getRgb();
                            [BODY_MATERIAL.color.r, BODY_MATERIAL.color.g, BODY_MATERIAL.color.b]
                                = [RGB_COLOR.r, RGB_COLOR.g, RGB_COLOR.b];
                            resolve(bodyMesh);
                        })
                        .catch(() => reject());
                })
            );
        });
        return Promise.all(COLORED_CAR_PARTS);
    }

    private addLights(): void {
        const HEADLIGHTS = [];
        const HEADLIGHT_FRONT_DIRECTION = new THREE.Vector3(0, 0, -1);
        Car.HEADLIGHT_OPTIONS.headlightPositions.forEach((headlightPosition) => {
            const HEADLIGHT = new THREE.SpotLight(
                Car.HEADLIGHT_OPTIONS.color,
                Car.HEADLIGHT_OPTIONS.intensity,
                Car.HEADLIGHT_OPTIONS.distance,
                Car.HEADLIGHT_OPTIONS.angle,
                Car.HEADLIGHT_OPTIONS.exponent,
                Car.HEADLIGHT_OPTIONS.decay
            );
            HEADLIGHT.position.copy(headlightPosition);
            HEADLIGHT.target.position.copy(
                headlightPosition.clone().add(HEADLIGHT_FRONT_DIRECTION)
            );
            this.add(HEADLIGHT.target);
            HEADLIGHTS.push(HEADLIGHT);
        });

        this.lights = {
            headlightLeft: HEADLIGHTS[0],
            headlightRight: HEADLIGHTS[1]
        };
        this.add(this.lights.headlightLeft, this.lights.headlightRight);
    }

}

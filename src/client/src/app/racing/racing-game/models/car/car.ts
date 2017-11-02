import * as THREE from 'three';

import { Logger } from '../../../../../../../common/src';
import { CarColor } from './car-color';
import { UserControllableCollidableMesh } from '../../physic/user-controllable-collidable';
import { CarHeadlight } from './car-headlight';
import { Kilograms, Seconds } from '../../../types';

export interface CarLights {
    headlightLeft: THREE.Light;
    headlightRight: THREE.Light;
}

export class Car extends UserControllableCollidableMesh {
    private static readonly MAX_ANGULAR_VELOCITY_TO_SPEED_RATIO = (Math.PI / 4) / (1); // (rad/s) / (m/s)

    private static readonly JSON_LOADER: THREE.JSONLoader = new THREE.JSONLoader();
    private static readonly BASE_PATH = 'assets/racing/car_model/';
    private static readonly FILE_EXTENSION = '.json';

    private static readonly HEADLIGHT_POSITIONS: THREE.Vector3[] = [
        new THREE.Vector3(-0.56077, 0.63412, -2.5),
        new THREE.Vector3( 0.56077, 0.63412, -2.5)
    ];

    public readonly mass: Kilograms = 100;

    private logger = Logger.getLogger('Car');
    private lights: CarLights;
    private boundingBox: THREE.Box3;

    protected maxSpeed = 50; // m/s
    protected maxAngularSpeed = Math.PI; // rad/s

    constructor(carColor: CarColor) {
        super();
        this.addLights();
        this.addCarParts(carColor);
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
                    (materials[0] as THREE.MeshPhongMaterial).shininess = 1000;
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
                            BODY_MATERIAL.shininess = 1000;
                            resolve(bodyMesh);
                        })
                        .catch(() => reject());
                })
            );
        });
        return Promise.all(COLORED_CAR_PARTS);
    }

    public updateAngularVelocity(deltaTime: Seconds) {
        const angularVelocityToSpeedRatio = this.angularVelocity.length() / this.velocity.length();
        if (angularVelocityToSpeedRatio > Car.MAX_ANGULAR_VELOCITY_TO_SPEED_RATIO) {
            this.angularVelocity.setLength(Car.MAX_ANGULAR_VELOCITY_TO_SPEED_RATIO * this.velocity.length());
        }
        super.updateAngularVelocity(deltaTime);
    }

    private addLights(): void {
        const HEADLIGHTS = [];
        const HEADLIGHT_FRONT_DIRECTION = new THREE.Vector3(0, 0, -1);
        Car.HEADLIGHT_POSITIONS.forEach((headlightPosition) => {
            const HEADLIGHT = new CarHeadlight();
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

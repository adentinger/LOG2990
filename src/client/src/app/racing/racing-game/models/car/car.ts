import * as THREE from 'three';

import { Logger } from '../../../../../../../common/src';
import { UserControllableCollidableMesh } from '../../physic/user-controllable-collidable';
import { CarHeadlight, CarHeadlightDayModeOptions } from './car-headlight';
import { Kilograms, Seconds } from '../../../types';
import { DayMode } from '../../day-mode/day-mode';
import { PhysicUtils } from '../../physic/engine';

export interface CarLights {
    headlightLeft: THREE.Light;
    headlightRight: THREE.Light;
}

export class Car extends UserControllableCollidableMesh {
    private static readonly MAX_ANGULAR_VELOCITY_TO_SPEED_RATIO = (Math.PI / 4) / (1); // (rad/s) / (m/s)
    private static readonly CAR_ENGINE_SOUND_URL = '/assets/racing/sounds/car-engine.ogg';
    private static readonly AUDIO_LOADER = new THREE.AudioLoader();

    private static logger = Logger.getLogger('Car');

    private static readonly JSON_LOADER: THREE.JSONLoader = new THREE.JSONLoader();
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
    private static readonly CAR_PARTS: Promise<THREE.Mesh[]> = Car.loadCarParts(Car.PART_NAMES);
    private static readonly CAR_COLORED_PARTS: Promise<THREE.Mesh[]> = Car.loadColoredCarParts();

    private static readonly HEADLIGHT_POSITIONS: THREE.Vector3[] = [
        new THREE.Vector3(-0.56077, 0.63412, -1.7),
        new THREE.Vector3(0.56077, 0.63412, -1.7)
    ];

    private static readonly SHININESS = 1000;

    public readonly mass: Kilograms = 100;

    private lights: CarLights;
    private boundingBox: THREE.Box3;

    protected maxSpeed = 50; // m/s
    protected maxAngularSpeed = Math.PI; // rad/s

    private previousVelocity = new THREE.Vector3();

    public waitToLoad: Promise<void>;
    public readonly audioListener = new THREE.AudioListener();
    public readonly audio = new THREE.PositionalAudio(this.audioListener);
    public readonly audioContext = new AudioContext();

    protected breakLightMeshs: THREE.Mesh;
    protected isStopped = false;
    protected dayModeOptions: CarHeadlightDayModeOptions;

    constructor(carColor: THREE.Color) {
        super();
        this.addLights();
        this.waitToLoad = this.addCarParts(carColor).then(() => {
            this.breakLightMeshs = this.getObjectByName('brake_light') as THREE.Mesh;
        });
        this.boundingBox = new THREE.Box3().setFromObject(this);
        this.add(this.audio);
        this.audio.autoplay = true;
        this.audio.setLoop(true);
        this.audio.setVolume(10);
        this.audio.setPlaybackRate(0.1);
        Car.AUDIO_LOADER.load(Car.CAR_ENGINE_SOUND_URL,
            (buffer: THREE.AudioBuffer) => {
                this.audio.setBuffer(buffer);
            }, () => { }, Car.logger.error);
    }

    private static loadCarPart(name: string): Promise<THREE.Mesh> {
        return new Promise((resolve, reject) => {
            Car.JSON_LOADER.load(
                Car.BASE_PATH + name + Car.FILE_EXTENSION,
                (geometry, materials) => {
                    const CAR_PART = new THREE.Mesh(geometry, materials[0]);
                    CAR_PART.name = name;
                    geometry.computeVertexNormals();
                    geometry['computeMorphNormals']();
                    (materials[0] as THREE.MeshPhongMaterial).blending = THREE.NoBlending;
                    (materials[0] as THREE.MeshPhongMaterial).shininess = Car.SHININESS;
                    (materials[0] as THREE.MeshPhongMaterial).emissiveIntensity = 0;
                    CAR_PART.receiveShadow = true;
                    CAR_PART.castShadow = true;
                    resolve(CAR_PART);
                },
                () => { },
                (reason) => { Car.logger.warn(reason); reject(reason); }
            );
        });
    }

    private static loadColoredCarParts(): Promise<THREE.Mesh[]> {
        const COLORED_CAR_PARTS: Promise<THREE.Mesh>[] = [];
        const COLORED_PART_NAMES = [
            'body'
        ];
        COLORED_PART_NAMES.forEach((partName) => {
            COLORED_CAR_PARTS.push(
                this.loadCarPart(partName)
                    .then((bodyMesh) => {
                        const BODY_MATERIAL = (bodyMesh.material as THREE.MeshPhongMaterial);
                        BODY_MATERIAL.shininess = Car.SHININESS;
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

    private async addCarParts(color: THREE.Color): Promise<void> {
        this.add(... await Car.CAR_PARTS.then((parts) =>
            parts.map((mesh) => mesh.clone())
                .map((mesh) => {
                    mesh.material = (mesh.material as THREE.Material).clone();
                    return mesh;
                })
        ));

        this.add(... await Car.CAR_COLORED_PARTS.then((parts) =>
            parts.map((mesh) => {
                const coloredMesh = mesh.clone();
                coloredMesh.material = (<THREE.MeshPhongMaterial>coloredMesh.material).clone();
                (<THREE.MeshPhongMaterial>coloredMesh.material).color.set(color);
                return coloredMesh;
            })
        ));
    }

    public updateAngularVelocity(deltaTime: Seconds) {
        const angularVelocityToSpeedRatio = this.angularVelocity.length() / this.velocity.length();
        if (angularVelocityToSpeedRatio > Car.MAX_ANGULAR_VELOCITY_TO_SPEED_RATIO) {
            this.angularVelocity.setLength(Car.MAX_ANGULAR_VELOCITY_TO_SPEED_RATIO * this.velocity.length());
        }
        super.updateAngularVelocity(deltaTime);
    }

    public update(utils: PhysicUtils, deltaTime: Seconds) {
        super.update(utils, deltaTime);
        this.audio.setPlaybackRate(2 * (this.velocity.length()) / this.maxSpeed + 0.4);

        if (this.isStopped && this.velocity.length() > UserControllableCollidableMesh.MIN_SPEED) {
            this.isStopped = false;
        }
        if (!this.isStopped && this.velocity.length() <= UserControllableCollidableMesh.MIN_SPEED) {
            this.isStopped = true;
        }
        if (this.breakLightMeshs) {
            if (this.velocity.length() > UserControllableCollidableMesh.MIN_SPEED &&
                this.velocity.length() > this.previousVelocity.length()) {
                (this.breakLightMeshs.material as THREE.MeshPhongMaterial).emissiveIntensity =
                    0.5 * this.dayModeOptions.intensity;
            }
            else {
                (this.breakLightMeshs.material as THREE.MeshPhongMaterial).emissiveIntensity =
                    0.5 + 0.5 * this.dayModeOptions.intensity;
            }
        }
        this.previousVelocity.copy(this.velocity);
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

    public startSounds() {
        this.audio.setVolume(10);
    }

    public stopSounds() {
        this.audio.setVolume(0);
    }

    public dayModeChanged(newMode: DayMode): void {
        this.dayModeOptions = newMode.CAR_HEADLIGHT_OPTIONS;
        const lights = this.getObjectByName('lights') as THREE.Mesh;
        if (lights) {
            (<THREE.MeshPhongMaterial>lights.material).emissiveIntensity = this.dayModeOptions.intensity;
            (<THREE.MeshPhongMaterial>this.breakLightMeshs.material).emissiveIntensity =
                0.5 * this.dayModeOptions.intensity + (this.isStopped ? 0.5 : 0);
        }
    }

}

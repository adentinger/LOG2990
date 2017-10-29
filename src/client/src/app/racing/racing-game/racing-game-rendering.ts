import * as THREE from 'three';

import { Skybox, SkyboxMode } from './three-objects/skybox/skybox';
import { RacingGamePlane } from './racing-game-map/racing-game-plane';
import { Car } from './three-objects/car/car';
import { CarColorYellow } from './three-objects/car/car-color-yellow';
import { CarColorBlue } from './three-objects/car/car-color-blue';
import { CarColorGreen } from './three-objects/car/car-color-green';

export class RacingGameRendering {
    private static readonly ARROW_HELPERS: THREE.ArrowHelper[] = [
        new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, 0xff0000),
        new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1, 0x00ff00),
        new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 1, 0x0000ff)
    ];

    public readonly WIDTH: number = window.innerWidth;
    public readonly HEIGHT: number = window.innerHeight;

    public readonly VIEW_ANGLE: number = 90;
    public readonly ASPECT: number = this.WIDTH / this.HEIGHT;

    public readonly NEAR: number = 0.05;
    public readonly FAR: number = 500;

    public readonly SCENE: THREE.Scene;
    public readonly CAMERA: THREE.PerspectiveCamera;
    public readonly RENDERER: THREE.WebGLRenderer;
    public readonly SKYBOX: Skybox;
    public readonly PLANE: RacingGamePlane;

    private displayWorldRefInternal: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.SCENE = new THREE.Scene();
        this.RENDERER = new THREE.WebGLRenderer({canvas: canvas});
        this.CAMERA = new THREE.PerspectiveCamera(
            this.VIEW_ANGLE,
            this.ASPECT,
            this.NEAR,
            this.FAR);
        this.SKYBOX = new Skybox(SkyboxMode.NIGHT);
        this.PLANE = new RacingGamePlane();
        const wireframePlane = new RacingGamePlane();
        (<THREE.MeshBasicMaterial>wireframePlane.material).wireframe = true;
        (<THREE.MeshBasicMaterial>wireframePlane.material).map = null;
        (<THREE.MeshBasicMaterial>wireframePlane.material).color = new THREE.Color( 0xffffff );
        wireframePlane.rotation.set(0, 0, 0);
        this.PLANE.add(wireframePlane);
        this.displayWorldRef = true;

        this.CAMERA.add(this.SKYBOX);
        this.SCENE.add(this.PLANE);
        this.SCENE.add(this.CAMERA);

        const LIGHTS = [
            new THREE.PointLight(0xffffff, 0.3),
            new THREE.PointLight(0xffffff, 0.3),
            new THREE.PointLight(0xffffff, 0.3)
        ];
        let i = 0;
        [LIGHTS[i].position.x, LIGHTS[i].position.y, LIGHTS[i++].position.z]
            = [10, 50, 100];
        [LIGHTS[i].position.x, LIGHTS[i].position.y, LIGHTS[i++].position.z]
            = [-10, 50, -100];
        [LIGHTS[i].position.x, LIGHTS[i].position.y, LIGHTS[i++].position.z]
            = [-100, 50, 10];
        this.SCENE.add(...LIGHTS);
        const CAR = new Car(new CarColorGreen());
        setInterval(() => CAR.position.setZ(CAR.position.z + 0.01), 1000 / 60);
        this.SCENE.add(CAR);

        const SPHERE = new THREE.Mesh(
            new THREE.SphereGeometry(0.5),
            new THREE.MeshPhongMaterial({color: 0x880000})
        );
        SPHERE.position.z = -5;
        SPHERE.position.y = .5;
        this.SCENE.add(SPHERE);
    }

    public set displayWorldRef(value: boolean) {
        this.displayWorldRefInternal = value;
        if (value) {
            this.SCENE.add(...RacingGameRendering.ARROW_HELPERS);
        }
        else {
            RacingGameRendering.ARROW_HELPERS.forEach(this.SCENE.remove);
        }
    }

    public setupScene(): void {
        this.setupCamera();
    }

    private setupCamera(): void {
        this.CAMERA.rotation.order = 'YXZ';
        this.CAMERA.position.set(0, 1, 0);
        this.CAMERA.lookAt(this.SCENE.position);
    }

}

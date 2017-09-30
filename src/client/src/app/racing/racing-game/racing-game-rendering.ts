import { Skybox } from './skybox';
import * as THREE from 'three';

export class RacingGameRendering {

    public readonly WIDTH: number = window.innerWidth;
    public readonly HEIGHT: number = window.innerHeight;

    public readonly VIEW_ANGLE: number = 75;
    public readonly ASPECT: number = this.WIDTH / this.HEIGHT;

    public readonly NEAR: number = 1;
    public readonly FAR: number = 100000;

    public SCENE: THREE.Scene;
    public CAMERA: THREE.PerspectiveCamera;
    public RENDERER: THREE.WebGLRenderer;
    private readonly FLOOR: THREE.Mesh;
    private readonly SKYBOX: Skybox;
    private readonly LIGHTS: THREE.Light[] = [];

    constructor() {
        this.SCENE = new THREE.Scene();
        this.RENDERER = new THREE.WebGLRenderer();
        this.CAMERA = new THREE.PerspectiveCamera(
            this.VIEW_ANGLE,
            this.ASPECT,
            this.NEAR,
            this.FAR);
        this.FLOOR = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 20, 20), new THREE.MeshBasicMaterial({ wireframe: true }));
        this.SKYBOX = new Skybox('Day');

        this.SCENE.add(this.CAMERA);
        this.RENDERER.setSize(this.WIDTH, this.HEIGHT);
    }

    public setupScene(): void {

        this.setupCamera();
        this.SCENE.add(this.CAMERA);
        this.SCENE.add(this.FLOOR);
        this.SCENE.add(this.SKYBOX);
    }

    private setupCamera(): void {
        this.CAMERA.position.set(0, 500, 1000);
        this.CAMERA.lookAt(this.SCENE.position);
    }

    private addLights(): void {
        const LIGHT: THREE.PointLight = new THREE.PointLight(0xffffff);
        [LIGHT.position.x, LIGHT.position.y, LIGHT.position.z] = [10, 50, 130];
        this.LIGHTS.push(LIGHT);
        this.SCENE.add(LIGHT);
    }

}

import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as MTLLoader from 'three-mtl-loader';

import { Skybox, SkyboxMode } from './skybox';
import { RacingGamePlane } from './racing-game-map/racing-game-plane';

OBJLoader(THREE);
(THREE['MTLLoader' as any]) = MTLLoader;

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

import * as THREE from 'three';

import { Skybox, SkyboxMode } from './skybox';
import { RacingGamePlane } from './racing-game-map/racing-game-plane';

export class RacingGameRendering {

    public readonly WIDTH: number = window.innerWidth;
    public readonly HEIGHT: number = window.innerHeight;

    public readonly VIEW_ANGLE: number = 75;
    public readonly ASPECT: number = this.WIDTH / this.HEIGHT;

    public readonly NEAR: number = 1;
    public readonly FAR: number = 1000000;

    public readonly SCENE: THREE.Scene;
    public readonly CAMERA: THREE.PerspectiveCamera;
    public readonly RENDERER: THREE.WebGLRenderer;
    public readonly SKYBOX: Skybox;
    public readonly PLANE: RacingGamePlane;

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

        this.SCENE.add(this.SKYBOX);
        this.SCENE.add(this.PLANE);
        this.SCENE.add(this.CAMERA);
    }

    public setupScene(): void {
        this.setupCamera();
    }

    private setupCamera(): void {
        this.CAMERA.rotation.order = 'YXZ';
        this.CAMERA.position.set(0, 0, 500);
        this.CAMERA.lookAt(this.SCENE.position);
    }

}

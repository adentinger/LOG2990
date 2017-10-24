import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as MTLLoader from 'three-mtl-loader';

import { Skybox, SkyboxMode } from './skybox';

OBJLoader(THREE);
(THREE['MTLLoader' as any]) = MTLLoader;

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

    constructor(canvas: HTMLCanvasElement) {
        this.SCENE = new THREE.Scene();
        this.RENDERER = new THREE.WebGLRenderer({canvas: canvas});
        this.CAMERA = new THREE.PerspectiveCamera(
            this.VIEW_ANGLE,
            this.ASPECT,
            this.NEAR,
            this.FAR);
        this.SKYBOX = new Skybox(SkyboxMode.NIGHT);

        this.SCENE.add(this.SKYBOX);
        this.SCENE.add(this.CAMERA);
    }

    public setupScene(): void {
        this.setupCamera();
    }

    private setupCamera(): void {
        this.CAMERA.rotation.order = 'YXZ';
        this.CAMERA.position.set(0, 500, 1000);
        this.CAMERA.lookAt(this.SCENE.position);
    }

}

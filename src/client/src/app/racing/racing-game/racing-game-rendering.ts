import * as THREE from 'three';

import { Skybox, SkyboxMode } from './skybox';
import { RacingGamePlane } from './racing-game-map/racing-game-plane';
import { MovablePerspectiveCamera, MovableOrthographicCamera } from './physic/examples/movable-camera';

export class RacingGameRenderer {
    private static readonly AXIS_HELPER: THREE.AxisHelper = new THREE.AxisHelper(1);

    public readonly WIDTH: number = window.innerWidth;
    public readonly HEIGHT: number = window.innerHeight;

    public readonly ORTHO_HEIGTH = 10;

    public readonly VIEW_ANGLE: number = 45;
    public readonly ASPECT: number = this.WIDTH / this.HEIGHT;

    public readonly NEAR: number = 0.05;
    public readonly FAR: number = 500;

    public readonly SCENE: THREE.Scene;
    public readonly RENDERER: THREE.WebGLRenderer;
    public readonly SKYBOX: Skybox;
    public readonly PLANE: RacingGamePlane;
    public readonly CAMERA1: MovablePerspectiveCamera;
    public readonly CAMERA2: MovableOrthographicCamera;
    public readonly cameraHelper: THREE.CameraHelper;

    public currentCamera: 0 | 1 = 0;

    private displayWorldRefInternal: boolean;

    public set displayWorldRef(value: boolean) {
        this.displayWorldRefInternal = value;
        if (value) {
            this.SCENE.add(RacingGameRenderer.AXIS_HELPER);
        }
        else {
            this.SCENE.remove(RacingGameRenderer.AXIS_HELPER);
        }
    }

    constructor(canvas: HTMLCanvasElement) {
        this.SCENE = new THREE.Scene();
        this.RENDERER = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        this.CAMERA1 = new MovablePerspectiveCamera(
            this.VIEW_ANGLE,
            this.ASPECT,
            this.NEAR,
            this.FAR);
        this.CAMERA2 = new MovableOrthographicCamera(
            -this.ORTHO_HEIGTH / 2 * this.ASPECT,
            this.ORTHO_HEIGTH / 2 * this.ASPECT,
            this.ORTHO_HEIGTH / 2,
            -this.ORTHO_HEIGTH / 2,
            this.NEAR,
            this.FAR
        );
        this.cameraHelper = new THREE.CameraHelper(this.CAMERA1);
        this.SKYBOX = new Skybox(SkyboxMode.NIGHT);
        this.displayWorldRef = true;

        this.CAMERA1.add(this.SKYBOX);
        this.SCENE.add(this.CAMERA1);
        this.SCENE.add(this.CAMERA2);
        // this.SCENE.add(this.SKYBOX.AMBIANT);
        this.SCENE.add(this.SKYBOX.DIRECTIONAL);

        this.setupScene();
    }

    public render(): void {
        const screenSize = this.RENDERER.getSize();
        this.RENDERER.setScissorTest(true);

        if (this.currentCamera === 1) {
            this.SCENE.add(this.cameraHelper);
        }
        this.RENDERER.setViewport(0, 0, screenSize.width, screenSize.height);
        this.RENDERER.setScissor(0, 0, screenSize.width, screenSize.height);
        this.RENDERER.render(this.SCENE, this.currentCamera === 0 ? this.CAMERA1 : this.CAMERA2);
        if (this.currentCamera === 1) {
            this.SCENE.remove(this.cameraHelper);
        }

        if (this.currentCamera === 0) {
            this.SCENE.add(this.cameraHelper);
        }
        this.RENDERER.setViewport(screenSize.width * 0.75, screenSize.height * 0.05,
            screenSize.width * 0.20, screenSize.height * 0.20);
        this.RENDERER.setScissor(screenSize.width * 0.75, screenSize.height * 0.05,
            screenSize.width * 0.20, screenSize.height * 0.20);
        this.RENDERER.render(this.SCENE, this.currentCamera === 0 ? this.CAMERA2 : this.CAMERA1);
        if (this.currentCamera === 0) {
            this.SCENE.remove(this.cameraHelper);
        }
    }

    private setupScene(): void {
        this.setupCameras();
    }

    private setupCameras(): void {
        this.CAMERA1.rotation.order = 'YXZ';
        this.CAMERA1.position.set(0, 1, 0);
        this.CAMERA1.rotation.set(0, 0, 0);

        this.CAMERA2.rotation.order = 'YXZ';
        this.CAMERA2.position.set(0, 10, 0);
        this.CAMERA2.lookAt(new THREE.Vector3());
    }

}

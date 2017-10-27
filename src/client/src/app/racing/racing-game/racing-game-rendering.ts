import * as THREE from 'three';

import { Skybox, SkyboxMode } from './skybox';
import { RacingGamePlane } from './racing-game-map/racing-game-plane';
import { MovablePerspectiveCamera, MovableOrthographicCamera } from './physic/examples/movable-camera';
import { Ball } from './physic/examples/ball';
import { OrthographicCamera } from './orthographic-camera';
import { PerspectiveCamera } from './perspective-camera';
import { Seconds } from '../types';

export class RacingGameRenderer {
    private static readonly AXIS_HELPER: THREE.AxisHelper = new THREE.AxisHelper(1);

    public newBall = new Ball(3);

    public readonly SCENE: THREE.Scene;
    public readonly RENDERER: THREE.WebGLRenderer;
    public readonly SKYBOX: Skybox;
    public readonly PLANE: RacingGamePlane;
    public readonly CAMERA1 = new PerspectiveCamera;
    public readonly CAMERA2 = new OrthographicCamera;
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

        this.cameraHelper = new THREE.CameraHelper(this.CAMERA1);
        this.SKYBOX = new Skybox(SkyboxMode.DAY);
        this.displayWorldRef = true;

        this.CAMERA1.add(this.SKYBOX);
        this.CAMERA1.setTarget(this.newBall);
        this.CAMERA2.setTarget(this.newBall);
        // this.SCENE.add(this.CAMERA2);
        this.SCENE.add(this.newBall);
        this.SCENE.add(this.SKYBOX.DIRECTIONAL);
    }

    public rotateBallRight(deltaTime: Seconds): void {
        const ANGULAR_VELOCITY = -Math.PI;
        this.newBall.rotateOnAxis(new THREE.Vector3(0, 1, 0), ANGULAR_VELOCITY * deltaTime);
    }

    public rotateBallLeft(deltaTime: Seconds): void {
        const ANGULAR_VELOCITY = Math.PI;
        this.newBall.rotateOnAxis(new THREE.Vector3(0, 1, 0), ANGULAR_VELOCITY * deltaTime);
    }

    public render(): void {
        const screenSize = this.RENDERER.getSize();
        this.RENDERER.setScissorTest(true);
        this.CAMERA2.updatePosition();

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

}

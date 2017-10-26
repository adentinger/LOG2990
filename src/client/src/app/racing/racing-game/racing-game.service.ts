import { Injectable } from '@angular/core';

import { RacingGameRenderer } from './racing-game-rendering';
import { Point } from '../../../../../common/src/math/point';
import { Interval } from '../../../../../common/src/math/interval';
import { PhysicEngine } from './physic/engine';
import { RenderableMap } from './racing-game-map/renderable-map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { Ball } from './physic/examples/ball';
import { MovablePerspectiveCamera, MovableOrthographicCamera } from './physic/examples/movable-camera';
import * as THREE from 'three';

@Injectable()
export class RacingGameService {

    public readonly WIDTH: number = window.innerWidth;
    public readonly HEIGHT: number = window.innerHeight;

    public readonly ORTHO_HEIGTH = 10;

    public readonly VIEW_ANGLE: number = 45;
    public readonly ASPECT: number = this.WIDTH / this.HEIGHT;

    public readonly NEAR: number = 0.05;
    public readonly FAR: number = 500;

    public renderer: RacingGameRenderer;
    private animationRequestId = 0;
    private isRendering = false;
    public readonly CAMERA1: MovablePerspectiveCamera;
    public readonly CAMERA2: MovableOrthographicCamera;
    public readonly cameraHelper: THREE.CameraHelper;

    private map: RenderableMap;

    public currentCamera: 0 | 1 = 0;

    constructor(private physicEngine: PhysicEngine) {
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
    }

    private newRacingGame(canvas: HTMLCanvasElement): boolean {
        let gameCreated = false;

        this.renderer = new RacingGameRenderer(canvas);
        if (this.renderer !== null) {
            gameCreated = true;
        }

        return gameCreated;
    }

    public initialise(canvas: HTMLCanvasElement, map: SerializedMap): void {
        this.newRacingGame(canvas);

        this.map = new RenderableMap(map);
        this.renderer.SCENE.add(this.map);
        this.physicEngine.setRoot(this.map);

        this.CAMERA1.add(this.renderer.SKYBOX);
        this.map.add(this.CAMERA1);
        this.map.add(this.CAMERA2);

        const BALL = new Ball(0.5);
        BALL.position.set(0, 0.001, -3);
        this.map.add(BALL);
        const BALL2 = new Ball(0.5);
        BALL2.position.set(1.5, 0.001, -3);
        BALL2.velocity.set(-0.5, 0, 0);
        this.map.add(BALL2);

        this.setupScene();
        this.physicEngine.start();
        this.startRendering();
    }

    public finalize() {
        this.physicEngine.stop();
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

    public set cameraRotation(rotation: Point) {
        const ROTATION = this.CAMERA1.rotation;
        ROTATION.x += -Math.PI / 2 * rotation.y;
        if (Math.abs(ROTATION.x) > Math.PI / 2) {
            ROTATION.x = Math.sign(ROTATION.x) * Math.PI / 2;
        }
        ROTATION.y += -Math.PI * rotation.x;
        ROTATION.y %= 2 * Math.PI;
        this.CAMERA2.rotation.y = ROTATION.y;
    }

    public get cameraVelocity(): THREE.Vector3 {
        return this.CAMERA1.velocity;
    }

    public set cameraVelocity(value: THREE.Vector3) {
        this.CAMERA1.velocity = value;
        this.CAMERA2.velocity = value;
    }

    public renderGame(): void {
        this.animationRequestId =
            requestAnimationFrame(() => this.renderGame());

        const screenSize = this.renderer.RENDERER.getSize();
        this.renderer.RENDERER.setScissorTest(true);

        if (this.currentCamera === 1) {
            this.renderer.SCENE.add(this.cameraHelper);
        }
        this.renderer.RENDERER.setViewport(0, 0, screenSize.width, screenSize.height);
        this.renderer.RENDERER.setScissor(0, 0, screenSize.width, screenSize.height);
        this.renderer.RENDERER.render(this.renderer.SCENE, this.currentCamera === 0 ? this.CAMERA1 : this.CAMERA2);
        if (this.currentCamera === 1) {
            this.renderer.SCENE.remove(this.cameraHelper);
        }

        if (this.currentCamera === 0) {
            this.renderer.SCENE.add(this.cameraHelper);
        }
        this.renderer.RENDERER.setViewport(screenSize.width * 0.75, screenSize.height * 0.05,
            screenSize.width * 0.20, screenSize.height * 0.20);
        this.renderer.RENDERER.setScissor(screenSize.width * 0.75, screenSize.height * 0.05,
            screenSize.width * 0.20, screenSize.height * 0.20);
        this.renderer.RENDERER.render(this.renderer.SCENE, this.currentCamera === 0 ? this.CAMERA2 : this.CAMERA1);
        if (this.currentCamera === 0) {
            this.renderer.SCENE.remove(this.cameraHelper);
        }
    }

    public startRendering(): void {
        if (!this.isRendering) {
            this.isRendering = true;
            this.renderGame();
        }
    }

    public stopRendering(): void {
        if (this.animationRequestId !== 0) {
            cancelAnimationFrame(this.animationRequestId);
        }
        this.isRendering = false;
    }

    public resizeCanvas(width: number, height: number) {
        this.renderer.RENDERER.setSize(width, height);
        this.CAMERA1.aspect = width / height;
        this.CAMERA1.updateProjectionMatrix();
        this.CAMERA2.left = this.CAMERA2.bottom * (width / height);
        this.CAMERA2.right = this.CAMERA2.top * (width / height);
        this.CAMERA2.updateProjectionMatrix();
    }

}

import * as THREE from 'three';

import { Skybox } from './three-objects/skybox/skybox';
import { RacingGamePlane } from './racing-game-map/racing-game-plane';
import { OrthographicCamera } from './orthographic-camera';
import { PerspectiveCamera } from './perspective-camera';
import { CarColorGreen } from './three-objects/car/car-color-green';
import { DayMode, DayModeManager } from './day-mode/day-mode-manager';
import { EventManager } from '../../event-manager.service';
import { Lighting } from './three-objects/lighting/lighting';

export class RacingGameRenderer {
    private static readonly AXIS_HELPER: THREE.AxisHelper = new THREE.AxisHelper(1);

    public readonly SCENE: THREE.Scene;
    public readonly RENDERER: THREE.WebGLRenderer;
    public readonly LIGHTING = new Lighting();
    public readonly SKYBOX: Skybox;
    public readonly PLANE: RacingGamePlane;
    public readonly CAMERA1: PerspectiveCamera;
    public readonly CAMERA2 = new OrthographicCamera;
    public readonly cameraHelper: THREE.CameraHelper;

    public currentCamera: 0 | 1 = 0;

    private displayWorldRefInternal: boolean;
    private readonly DAY_MODE_MANAGER = new DayModeManager();

    constructor(canvas: HTMLCanvasElement, eventManager: EventManager) {
        this.SCENE = new THREE.Scene();
        this.RENDERER = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

        this.SKYBOX = new Skybox();

        this.PLANE = new RacingGamePlane();
        this.SCENE.add(this.PLANE);

        this.displayWorldRef = true;

        this.SCENE.add(this.LIGHTING);

        this.CAMERA1 = new PerspectiveCamera(eventManager);
        this.cameraHelper = new THREE.CameraHelper(this.CAMERA1);

        this.CAMERA1.add(this.SKYBOX);
    }

    public set displayWorldRef(value: boolean) {
        this.displayWorldRefInternal = value;
        if (value) {
            this.SCENE.add(RacingGameRenderer.AXIS_HELPER);
        }
        else {
            this.SCENE.remove(RacingGameRenderer.AXIS_HELPER);
        }
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

    public updateDayMode(newMode: DayMode): void {
        this.DAY_MODE_MANAGER.mode = newMode;
        this.DAY_MODE_MANAGER.updateScene(this.SCENE);
    }

}

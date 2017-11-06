import * as THREE from 'three';

import { Skybox } from '../models/skybox/skybox';
import { OrthographicCamera } from './orthographic-camera';
import { PerspectiveCamera } from './perspective-camera';
import { DayMode, DayModeManager } from '../day-mode/day-mode-manager';
import { EventManager } from '../../../event-manager.service';
import { Lighting } from '../models/lighting/lighting';
import { RenderableMap } from '../racing-game-map/renderable-map';

export type CameraId = 0 | 1;

export class RacingRenderer extends THREE.WebGLRenderer {
    private static readonly AXIS_HELPER: THREE.AxisHelper = new THREE.AxisHelper(1);

    private canvasContainer: HTMLDivElement;

    protected readonly scene = new THREE.Scene();
    protected readonly lighting = new Lighting();
    protected readonly skybox = new Skybox();
    protected readonly cameras: [PerspectiveCamera, OrthographicCamera] = [null, null];

    private animationRequestId = -1;
    private isRendering = false;

    public currentCamera: CameraId = 0;

    private readonly dayModeManager = new DayModeManager();

    constructor(eventManager: EventManager) {
        super({ antialias: true });
        this.shadowMap.enabled = false;
        this.shadowMap.type = THREE.PCFSoftShadowMap;

        this.cameras[0] = new PerspectiveCamera(eventManager);
        this.cameras[1] = new OrthographicCamera();

        this.cameras[0].add(this.skybox);
    }

    public initialize(container: HTMLDivElement) {
        this.canvasContainer = container;
        this.canvasContainer.appendChild(this.domElement);

        this.scene.add(this.lighting);
        this.scene.add(RacingRenderer.AXIS_HELPER);
    }

    public finalize() {
        this.canvasContainer.removeChild(this.domElement);

        // Remove all children to be ready for the next game.
        this.scene.children.forEach(this.scene.remove, this.scene);
    }

    public startRendering(): void {
        if (!this.isRendering) {
            this.isRendering = true;
            this.runRenderLoop();
        }
    }

    public stopRendering(): void {
        if (this.animationRequestId !== 0) {
            cancelAnimationFrame(this.animationRequestId);
            this.animationRequestId = 0;
        }
        this.isRendering = false;
    }

    public runRenderLoop(): void {
        this.animationRequestId =
            requestAnimationFrame(() => this.runRenderLoop());

        this.renderGame();
    }

    public renderGame(): void {
        const screenSize = this.getSize();
        this.setScissorTest(true);
        this.cameras[1].updatePosition();

        this.setViewport(0, 0, screenSize.width, screenSize.height);
        this.setScissor(0, 0, screenSize.width, screenSize.height);
        this.render(this.scene, this.cameras[this.currentCamera]);

        this.setViewport(screenSize.width * 0.75, screenSize.height * 0.05,
            screenSize.width * 0.20, screenSize.height * 0.20);
        this.setScissor(screenSize.width * 0.75, screenSize.height * 0.05,
            screenSize.width * 0.20, screenSize.height * 0.20);
        this.render(this.scene, this.cameras[+!this.currentCamera]);
    }

    public setCamerasTarget(target: THREE.Object3D): void {
        this.cameras.forEach((camera) => {
            camera.setTarget(target);
            if ('audioListener' in target && target['audioListener'] instanceof THREE.AudioListener) {
                camera.add(target['audioListener']);
            }
        });
    }

    public updateSize(width: number, height: number) {
        this.setSize(width, height);

        this.cameras[0].aspect = width / height;
        this.cameras[0].updateProjectionMatrix();

        this.cameras[1].left = this.cameras[1].bottom * (width / height);
        this.cameras[1].right = this.cameras[1].top * (width / height);
        this.cameras[1].updateProjectionMatrix();
    }

    public addMap(map: RenderableMap) {
        this.scene.add(map);
    }

    public removeMap(map: RenderableMap) {
        this.scene.remove(map);
    }

    public updateDayMode(newMode: DayMode): void {
        this.dayModeManager.mode = newMode;
        this.dayModeManager.updateScene(this.scene);
        this.shadowMap.enabled = newMode === DayMode.DAY;
    }

}

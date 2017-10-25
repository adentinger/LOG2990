import * as THREE from 'three';

import { Skybox, SkyboxMode } from './skybox';
import { RacingGamePlane } from './racing-game-map/racing-game-plane';
import { MovablePerspectiveCamera } from './physic/examples/movable-camera';

export class RacingGameRenderer {
    private static readonly ARROW_HELPERS: THREE.ArrowHelper[] = [
        new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, 0xff0000),
        new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1, 0x00ff00),
        new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 1, 0x0000ff)
    ];

    public readonly WIDTH: number = window.innerWidth;
    public readonly HEIGHT: number = window.innerHeight;

    public readonly VIEW_ANGLE: number = 75;
    public readonly ASPECT: number = this.WIDTH / this.HEIGHT;

    public readonly NEAR: number = 0.05;
    public readonly FAR: number = 500;

    public readonly SCENE: THREE.Scene;
    public readonly CAMERA1: MovablePerspectiveCamera;
    public readonly RENDERER: THREE.WebGLRenderer;
    public readonly SKYBOX: Skybox;
    public readonly PLANE: RacingGamePlane;

    private displayWorldRefInternal: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.SCENE = new THREE.Scene();
        this.RENDERER = new THREE.WebGLRenderer({canvas: canvas});
        this.CAMERA1 = new MovablePerspectiveCamera(
            this.VIEW_ANGLE,
            this.ASPECT,
            this.NEAR,
            this.FAR);
        this.SKYBOX = new Skybox(SkyboxMode.NIGHT);
        this.displayWorldRef = true;

        this.CAMERA1.add(this.SKYBOX);
        this.SCENE.add(this.CAMERA1);
        this.SCENE.add(this.SKYBOX.AMBIANT);
    }

    public set displayWorldRef(value: boolean) {
        this.displayWorldRefInternal = value;
        if (value) {
            this.SCENE.add(...RacingGameRenderer.ARROW_HELPERS);
        }
        else {
            RacingGameRenderer.ARROW_HELPERS.forEach(this.SCENE.remove);
        }
    }

    public setupScene(): void {
        this.setupCamera();
    }

    private setupCamera(): void {
        this.CAMERA1.rotation.order = 'YXZ';
        this.CAMERA1.position.set(0, 1, 0);
        this.CAMERA1.rotation.set(0, 0, 0);
    }

}

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

    public readonly SCENE: THREE.Scene;
    public readonly RENDERER: THREE.WebGLRenderer;
    public readonly SKYBOX: Skybox;
    public readonly PLANE: RacingGamePlane;

    private displayWorldRefInternal: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.SCENE = new THREE.Scene();
        this.RENDERER = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
        this.SKYBOX = new Skybox(SkyboxMode.NIGHT);
        this.displayWorldRef = true;

        // this.SCENE.add(this.SKYBOX.AMBIANT);
        this.SCENE.add(this.SKYBOX.DIRECTIONAL);
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

}

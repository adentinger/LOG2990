import { Injectable } from '@angular/core';

import { RacingGameRenderer } from './racing-game-rendering';
import { PhysicEngine } from './physic/engine';
import { RenderableMap } from './racing-game-map/renderable-map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import * as THREE from 'three';
import { CollidableMesh } from './physic/collidable';
import { Meters } from '../types';
import { DayMode } from './day-mode/day-mode-manager';

class Wall extends CollidableMesh {
    constructor (width: Meters, heigth: Meters) {
        super(
            new THREE.PlaneGeometry(width, heigth),
            new THREE.MeshBasicMaterial({wireframe: true})
        );
    }
}

@Injectable()
export class RacingGameService {

    public renderer: RacingGameRenderer;
    private animationRequestId = 0;
    private isRendering = false;
    private dayMode: DayMode = DayMode.DAY;

    private map: RenderableMap;

    constructor(private physicEngine: PhysicEngine) { }

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
        this.physicEngine.setRoot(this.renderer.SCENE);

        this.map = new RenderableMap(map);
        this.renderer.SCENE.add(this.map);

        const wall1 = new Wall(10, 10);
        wall1.position.set(0, 0, -5);
        const wall2 = new Wall(10, 10);
        wall2.position.set(5, 0, 0);
        wall2.rotation.y = Math.PI / 2;
        const wall3 = new Wall(10, 10);
        wall3.position.set(-5, 0, 0);
        wall3.rotation.y = - Math.PI / 2;
        const wall4 = new Wall(10, 10);
        wall4.position.set(0, 0, 5);

        this.physicEngine.start();
        this.startRendering();
    }

    public finalize() {
        this.physicEngine.stop();
        this.stopRendering();
    }

    public renderGame(): void {
        this.animationRequestId =
            requestAnimationFrame(() => this.renderGame());

        this.renderer.render();
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
            this.animationRequestId = 0;
        }
        this.isRendering = false;
    }

    public resizeCanvas(width: number, height: number) {
        this.renderer.RENDERER.setSize(width, height);
        this.renderer.CAMERA1.aspect = width / height;
        this.renderer.CAMERA1.updateProjectionMatrix();

        this.renderer.CAMERA2.left = this.renderer.CAMERA2.bottom * (width / height);
        this.renderer.CAMERA2.right = this.renderer.CAMERA2.top * (width / height);
        this.renderer.CAMERA2.updateProjectionMatrix();
    }

    public changeDayMode(): void {
        let newMode: DayMode;
        switch (this.dayMode) {
            case DayMode.DAY: newMode = DayMode.NIGHT; break;
            case DayMode.NIGHT: newMode = DayMode.DAY; break;
            default: break;
        }
        this.dayMode = newMode;
        this.renderer.updateDayMode(this.dayMode);
    }

}

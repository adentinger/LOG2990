import { Injectable } from '@angular/core';

import { RacingGameRenderer } from './racing-game-rendering';
import { PhysicEngine } from './physic/engine';
import { RenderableMap } from './racing-game-map/renderable-map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import * as THREE from 'three';
import { CollidableMesh } from './physic/collidable';
import { Meters } from '../types';
import { DayMode } from './day-mode/day-mode-manager';
import { UIInputs } from './ui-input.service';
import { Cube } from './physic/examples/ball';
import { Car } from './three-objects/car/car';
import { CarColorGreen } from './three-objects/car/car-color-green';
import { EventManager } from '../../event-manager.service';

class Wall extends CollidableMesh {
    public readonly mass = Infinity;
    constructor(width: Meters, heigth: Meters) {
        super(
            new THREE.PlaneGeometry(width, heigth),
            new THREE.MeshBasicMaterial({ wireframe: true })
        );
    }
}

@Injectable()
export class RacingGameService {

    public renderer: RacingGameRenderer;
    private animationRequestId = 0;
    private isRendering = false;
    private dayMode: DayMode = DayMode.DAY;
    public readonly CAR: Car = new Car(new CarColorGreen());

    private map: RenderableMap;

    constructor(private physicEngine: PhysicEngine) { }

    private newRacingGame(canvas: HTMLCanvasElement, eventManager: EventManager): boolean {
        let gameCreated = false;

        this.renderer = new RacingGameRenderer(canvas, eventManager);
        if (this.renderer !== null) {
            gameCreated = true;
        }

        return gameCreated;
    }

    public initialise(canvas: HTMLCanvasElement,
        map: SerializedMap,
        userInputs: UIInputs,
        eventManager: EventManager): void {

        this.newRacingGame(canvas, eventManager);
        this.physicEngine.setRoot(this.renderer.SCENE);
        this.renderer.updateDayMode(this.dayMode);

        this.map = new RenderableMap(map);
        this.renderer.SCENE.add(this.map);

        this.CAR.setUIInput(userInputs);
        this.CAR.translateZ(15);
        this.renderer.SCENE.add(this.CAR);
        this.renderer.SCENE.add(this.CAR.corner1);
        this.renderer.SCENE.add(this.CAR.corner2);
        this.renderer.SCENE.add(this.CAR.corner3);
        this.renderer.SCENE.add(this.CAR.corner4);

        this.renderer.CAMERA1.setTarget(this.CAR);
        this.renderer.CAMERA2.setTarget(this.CAR);

        const BALL1 = new Cube(0.5);
        BALL1.position.set(0, 0, -3);
        this.map.add(BALL1);
        const BALL2 = new Cube(0.5);
        BALL2.position.set(1.5, 0, -1.75);
        BALL2.velocity.set(-1, 0, -1);
        this.map.add(BALL2);

        const wall1 = new Wall(10, 10);
        wall1.position.set(0, 0, -5);
        const wall2 = new Wall(10, 10);
        wall2.position.set(5, 0, 0);
        wall2.rotation.y = 3 * Math.PI / 2;
        const wall3 = new Wall(10, 10);
        wall3.position.set(-5, 0, 0);
        wall3.rotation.y = Math.PI / 2;
        const wall4 = new Wall(10, 10);
        wall4.position.set(0, 0, 5);
        wall4.rotation.y = Math.PI;
        this.map.add(wall1, wall2, wall3, wall4);

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

import { Injectable } from '@angular/core';

import { RacingGameRenderer } from './racing-game-rendering';
import { Point } from '../../../../../common/src/math/point';
import { PhysicEngine } from './physic/engine';
import { RenderableMap } from './racing-game-map/renderable-map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { Ball } from './physic/examples/ball';
import * as THREE from 'three';
import { CollidableMesh } from './physic/collidable';
import { Meters } from '../types';

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
    private velocityTimer: any = null;

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
/*
        const BALL1 = new Ball(0.5);
        BALL1.position.set(0, 0.001, -3);
        this.map.add(BALL1);
        const BALL2 = new Ball(0.5);
        BALL2.position.set(1.5, 0.001, -2);
        BALL2.velocity.set(-0.5, 0, -0.5);
        this.map.add(BALL2);*/

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
        // this.map.add(wall1, wall2, wall3, wall4);

        this.physicEngine.start();
        this.startRendering();
    }

    public finalize() {
        clearInterval(this.velocityTimer);
        this.physicEngine.stop();
        this.stopRendering();
    }

    public set carRotation(rotation: Point) {
        const ROTATION = this.renderer.newBall.rotation;
        ROTATION.x += -Math.PI / 2 * rotation.y;
        if (Math.abs(ROTATION.x) > Math.PI / 2) {
            ROTATION.x = Math.sign(ROTATION.x) * Math.PI / 2;
        }
        ROTATION.y += -Math.PI * rotation.x;
        ROTATION.y %= 2 * Math.PI;
    }

    public get carVelocity(): THREE.Vector3 {
        return this.renderer.newBall.velocity;
    }

    public set carVelocity(value: THREE.Vector3) {
        this.renderer.newBall.velocity = value;
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

}

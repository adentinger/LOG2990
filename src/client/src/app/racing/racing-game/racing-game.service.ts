import { Injectable, ElementRef } from '@angular/core';
import { RacingGameRendering } from './racing-game-rendering';
import { Point } from '../../common/math/point';

@Injectable()
export class RacingGameService {

    public racingGameRendering: RacingGameRendering;
    private animationRequestId = 0;
    private isRendering = false;
    private mousePositionInternal = new Point(0, 0);

    constructor() { }

    private newRacingGame(canvas: ElementRef): boolean {
        let gameCreated = false;

        this.racingGameRendering = new RacingGameRendering(canvas);
        if (this.racingGameRendering !== null) {
            gameCreated = true;
        }

        return gameCreated;
    }

    public initialise(canvas: ElementRef): void {
        this.newRacingGame(canvas);
        this.startRendering();
        this.racingGameRendering.setupScene();
    }

    public get mousePosition(): Point {
        return this.mousePositionInternal;
    }

    public set mousePosition(mousePosition: Point) {
        this.racingGameRendering.CAMERA.rotateY(
            this.mousePositionInternal.x - mousePosition.x);
        this.racingGameRendering.CAMERA.rotateX(
            this.mousePositionInternal.y - mousePosition.y);
    }

    public renderGame(): void {
        this.animationRequestId =
            requestAnimationFrame(() => this.renderGame());
        this.racingGameRendering.RENDERER.render(this.racingGameRendering.SCENE, this.racingGameRendering.CAMERA);
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

}

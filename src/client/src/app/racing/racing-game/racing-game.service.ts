import { Injectable, ElementRef } from '@angular/core';
import { RacingGameRendering } from './racing-game-rendering';

@Injectable()
export class RacingGameService {

    public racingGameRendering: RacingGameRendering;
    private animationRequestId = 0;
    private isRendering = false;

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

    public renderGame(): void {
        this.animationRequestId = requestAnimationFrame(this.renderGame.bind(this));
        this.racingGameRendering.RENDERER.render(this.racingGameRendering.SCENE, this.racingGameRendering.CAMERA);
    }

    private startRendering(): void {
        if (!this.isRendering) {
            this.isRendering = true;
            this.renderGame();
        }
    }

    private stopRendering(): void {
        if (this.animationRequestId !== 0) {
            cancelAnimationFrame(this.animationRequestId);
        }
        this.isRendering = false;
    }
/*
    public updateRenderer(): void {
        this.racingGameRendering.RENDERER.render(this.racingGameRendering.SCENE, this.racingGameRendering.CAMERA);
        this.startRendering();
    }
    */
}

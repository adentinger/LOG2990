import { Injectable } from '@angular/core';
import { RacingGameRendering } from './racing-game-rendering';

@Injectable()
export class RacingGameService {

    public racingGameRendering: RacingGameRendering;
    private animationRequestId = 0;
    private isRendering = false;

    constructor() {
        this.newRacingGame();
    }

    private newRacingGame(): boolean {
        let gameCreated = false;

        this.racingGameRendering = new RacingGameRendering();
        if (this.racingGameRendering !== null) {
            console.log('allo');
            gameCreated = true;
        }

        return gameCreated;
    }

    public initialise(): void {
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

    public updateRenderer(): void {
        this.racingGameRendering.RENDERER.render(this.racingGameRendering.SCENE, this.racingGameRendering.CAMERA);
        this.startRendering();
    }
}

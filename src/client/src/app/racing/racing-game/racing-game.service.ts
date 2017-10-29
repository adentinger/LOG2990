import { Injectable } from '@angular/core';

import { RacingGameRendering } from './racing-game-rendering';
import { Point } from '../../../../../common/src/math/point';
import { Interval } from '../../../../../common/src/math/interval';
import { DayMode } from './day-mode/day-mode';

@Injectable()
export class RacingGameService {

    public racingGameRendering: RacingGameRendering;
    private animationRequestId = 0;
    private isRendering = false;
    private cursorPositionInternal = new Point(0, 0);
    private dayMode: DayMode = DayMode.DAY;

    constructor() { }

    private newRacingGame(canvas: HTMLCanvasElement): boolean {
        let gameCreated = false;

        this.racingGameRendering = new RacingGameRendering(canvas);
        if (this.racingGameRendering !== null) {
            gameCreated = true;
        }

        return gameCreated;
    }

    public initialise(canvas: HTMLCanvasElement): void {
        this.newRacingGame(canvas);
        this.startRendering();
        this.racingGameRendering.setupScene();
        this.racingGameRendering.updateDayMode(this.dayMode);
    }

    /**
     * @returns A point where x and y belong to [-1, 1],
     * -1 corresponding (respectively) to left and top,
     * and 1 corresponding (respectively) to right and bottom
     * of the screen.
     */
    public get cursorPosition(): Point {
        return this.cursorPositionInternal;
    }

    public set cursorPosition(cursorPosition: Point) {
        const VALID_INTERVAL = new Interval(-1, 1);
        const IS_CURSOR_VALID =
            VALID_INTERVAL.contains(cursorPosition.x) &&
            VALID_INTERVAL.contains(cursorPosition.y);

        if (IS_CURSOR_VALID) {
            this.racingGameRendering.CAMERA.rotation.x = -Math.PI / 2 * cursorPosition.y;
            this.racingGameRendering.CAMERA.rotation.y = -Math.PI * cursorPosition.x;
            this.cursorPositionInternal = cursorPosition;
        }
        else {
            throw new Error('Cursor position invalid: (' +
                cursorPosition.x + ', ' + cursorPosition.y + ')');
        }
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

    public changeDayMode(): void {
        let newMode: DayMode;
        switch (this.dayMode) {
            case DayMode.DAY: newMode = DayMode.NIGHT; break;
            case DayMode.NIGHT: newMode = DayMode.DAY; break;
            default: break;
        }
        this.dayMode = newMode;
        this.racingGameRendering.updateDayMode(this.dayMode);
    }

}

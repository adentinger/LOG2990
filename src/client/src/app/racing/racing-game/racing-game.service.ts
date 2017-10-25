import { Injectable } from '@angular/core';

import { RacingGameRenderer } from './racing-game-rendering';
import { Point } from '../../../../../common/src/math/point';
import { Interval } from '../../../../../common/src/math/interval';
import { PhysicEngine } from './physic/engine';
import { RenderableMap } from './racing-game-map/renderable-map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';

@Injectable()
export class RacingGameService {

    public renderer: RacingGameRenderer;
    private animationRequestId = 0;
    private isRendering = false;
    private cursorPositionInternal = new Point(0, 0);

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
        this.map = new RenderableMap(map);
        this.newRacingGame(canvas);
        this.renderer.SCENE.remove(this.renderer.CAMERA1);
        this.map.add(this.renderer.CAMERA1);
        this.renderer.SCENE.add(this.map);
        this.physicEngine.setRoot(this.map);
        this.physicEngine.start();
        this.startRendering();
        this.renderer.setupScene();
    }

    public finalize() {
        this.physicEngine.stop();
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
            this.renderer.CAMERA1.rotation.x = -Math.PI / 2 * cursorPosition.y;
            this.renderer.CAMERA1.rotation.y = -Math.PI * cursorPosition.x;
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
        this.renderer.RENDERER.render(this.renderer.SCENE, this.renderer.CAMERA1);
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

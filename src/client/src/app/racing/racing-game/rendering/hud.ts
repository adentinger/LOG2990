import * as THREE from 'three';
import { Seconds } from '../../types';
import { GameInfo } from '../game-info';

export interface Time {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
}

export class HUD {
    private static readonly FONT_FAMILLY = 'system-ui';
    private static readonly TEXT_COLOR = '#ffd700';

    private static readonly TEXT_HEIGTH = 0.05; // height (proportion of the screen height), normalized between 0 and 1
    private static readonly TEXT_OFFSET = 0.01;
    private static readonly INCREMENT = new THREE.Vector2(0, HUD.TEXT_HEIGTH + 2 * HUD.TEXT_OFFSET);
    private static readonly LAP_POSITION =
    new THREE.Vector2(HUD.TEXT_OFFSET, HUD.TEXT_HEIGTH + HUD.TEXT_OFFSET);
    private static readonly LAP_TIME_POSITION = HUD.LAP_POSITION.clone().add(HUD.INCREMENT);
    private static readonly GAME_TIME_POSITION = HUD.LAP_TIME_POSITION.clone().add(HUD.INCREMENT);
    private static readonly RACE_PLACE_POSITION =
        new THREE.Vector2(1 - HUD.TEXT_OFFSET, HUD.TEXT_HEIGTH + HUD.TEXT_OFFSET);

    private context: CanvasRenderingContext2D = null;
    private domElementInternal: HTMLCanvasElement = null;
    public get domElement(): HTMLCanvasElement {
        return this.domElementInternal;
    }

    private static getFont(size: number): string {
        return `${size}px ${HUD.FONT_FAMILLY}`;
    }

    private static getFormatedNumber(n: number, minDigitCount: number): string {
        const BASE = 10;
        n = (n < 0) ? 0 : Math.floor(n);
        const nToString = n.toString(BASE);
        const digitCount = Math.max(Math.ceil(Math.log(n + 1) / Math.log(BASE)), 1);
        return '0'.repeat(Math.max(minDigitCount - digitCount, 0)) + nToString;
    }

    public initialize(canvas: HTMLCanvasElement): void {
        this.domElementInternal = canvas;
        this.context = this.domElement.getContext('2d', { alpha: true });
    }

    public finalize(): void {
        delete this.domElementInternal;
        delete this.context;
    }

    public setSize(width: number, height: number): void {
        this.domElementInternal.setAttribute('width', width.toString());
        this.domElementInternal.setAttribute('height', height.toString());
    }

    public render(game: GameInfo): void {
        const width = this.domElement.width, height = this.domElement.height;

        this.context.clearRect(0, 0, width, height);
        this.context.font = HUD.getFont(HUD.TEXT_HEIGTH * height);
        this.context.fillStyle = HUD.TEXT_COLOR;

        this.drawLapCount(this.context, game);
        this.drawLapTime(this.context, game);
        this.drawGameTime(this.context, game);
        this.drawRacePosition(this.context, game);
    }

    private drawLapCount(context: CanvasRenderingContext2D, game: GameInfo): void {
        const height = context.canvas.height, width = context.canvas.width;

        const size = new THREE.Vector2(width, height);
        const textPosition = HUD.LAP_POSITION.clone().multiply(size);

        this.context.fillText(`${game.lap}/${game.maxLap} laps`,
            textPosition.x, textPosition.y);
    }

    private drawLapTime(context: CanvasRenderingContext2D, game: GameInfo): void {
        const height = context.canvas.height, width = context.canvas.width;

        const size = new THREE.Vector2(width, height);
        const textPosition = HUD.LAP_TIME_POSITION.clone().multiply(size);

        const gameTime = this.getTime(game.lapTimes[game.lap - 1]);
        const currentTime = this.formatTime(gameTime);
        this.context.fillText(`Lap time: ${currentTime}`,
            textPosition.x, textPosition.y);
    }

    private drawGameTime(context: CanvasRenderingContext2D, game: GameInfo): void {
        const height = context.canvas.height, width = context.canvas.width;

        const size = new THREE.Vector2(width, height);
        const textPosition = HUD.GAME_TIME_POSITION.clone().multiply(size);

        const gameTime = this.getTime(game.totalTime);
        const currentTime = this.formatTime(gameTime);
        this.context.fillText(`Time: ${currentTime}`,
            textPosition.x, textPosition.y);
    }

    private drawRacePosition(context: CanvasRenderingContext2D, game: GameInfo): void {
        const height = context.canvas.height, width = context.canvas.width;

        const size = new THREE.Vector2(width, height);
        const textPosition = HUD.RACE_PLACE_POSITION.clone().multiply(size);

        const position = game.positions.findIndex((car) => car === game.controlledCar) + 1;
        const suffix = position > 3 ? 'th' : ( position === 3 ? 'rd' : (position === 1 ? 'nd' : 'st'));

        const text = `${position}${suffix}`;
        const textWidth = this.context.measureText(text).width;
        this.context.fillText(text,
            textPosition.x - textWidth, textPosition.y);
    }

    private getTime(time: Seconds): Time {
        const formatedTime: any = {};

        formatedTime.milliseconds = (time * 1000) % 1000;
        time = Math.floor(time);
        formatedTime.seconds = time % 60;
        time = Math.floor(time / 60);
        formatedTime.minutes = time % 60;
        formatedTime.hours = Math.floor(time / 60);

        return formatedTime;
    }

    private formatTime(time: Time): string {
        return (time.hours > 0 ? HUD.getFormatedNumber(time.hours, 2) + 'h ' : '') +
            HUD.getFormatedNumber(time.minutes, 2) + '\' ' +
            HUD.getFormatedNumber(time.seconds, 2) + '.' +
            HUD.getFormatedNumber(time.milliseconds / 10, 2) + '"';
    }
}

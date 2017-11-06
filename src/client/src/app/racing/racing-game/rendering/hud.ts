import * as THREE from 'three';
import { RacingGameService } from '../racing-game.service';

export class HeadUpDisplay {
    private static readonly FONT_SIZE = '48px';
    private static readonly FONT_FAMILLY = 'system-ui';
    private static readonly FONT = [HeadUpDisplay.FONT_SIZE, HeadUpDisplay.FONT_FAMILLY].join(' ');
    private static readonly TEXT_COLOR = '#ffd700';

    private static readonly CLEAR_COLOR = new THREE.Color('black');

    private canvasContainer: HTMLDivElement;

    private context: CanvasRenderingContext2D = null;
    private domElementInternal: HTMLCanvasElement = null;
    public get domElement(): HTMLCanvasElement {
        return this.domElementInternal;
    }

    private static getFont(size: number): string {
        return `${size}px ${HeadUpDisplay.FONT_FAMILLY}`;
    }

    constructor() {
        this.domElementInternal = document.createElement('canvas');
        this.context = this.domElement.getContext('2d', { alpha: true });
    }

    public initialize(container: HTMLDivElement): void {
        this.canvasContainer = container;
        this.canvasContainer.appendChild(this.domElement);
        const angularAttribute = Array.from(this.canvasContainer.attributes).find((attribute) => {
            return attribute.name.startsWith('_ngcontent');
        });
        this.domElementInternal.setAttribute(angularAttribute.name, '');
    }

    public finalize(): void {
        this.canvasContainer.removeChild(this.domElement);
        const angularAttribute = Array.from(this.canvasContainer.attributes).find((attribute) => {
            return attribute.name.startsWith('_ngcontent');
        });
        this.domElementInternal.removeAttribute(angularAttribute.name);
    }

    public render(game: RacingGameService): void {
        const width = this.domElement.width, height = this.domElement.height;

        this.context.clearRect(0, 0, width, height);

        this.context.font = HeadUpDisplay.getFont(0.05 * height);
        this.context.fillStyle = HeadUpDisplay.TEXT_COLOR;
        this.context.fillText(`${game.lap}/${game.maxLap} laps`, 0, 0.05 * height);
    }

    public setSize(width: number, height: number) {
        this.domElementInternal.setAttribute('width', width.toString());
        this.domElementInternal.setAttribute('height', height.toString());
        this.domElementInternal.style.setProperty('width', width.toString() + 'px');
        this.domElementInternal.style.setProperty('height', height.toString() + 'px');
    }
}

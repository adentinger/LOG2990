import { Drawable } from './drawable';
import { Point } from '../point';

export const INNER_COLOR_IDX = 0;
export const RIM_COLOR_IDX   = INNER_COLOR_IDX + 1;

const INNER_RADIUS = 15.0;
const RIM_RADIUS   = 20.0;

export abstract class AbstractMapPoint extends Point implements Drawable {

    private context: CanvasRenderingContext2D;
    private isActive = false;
    private activeColors: string[];
    private inactiveColors: string[];

    constructor(context: CanvasRenderingContext2D,
                x: number,
                y: number,
                activeColors: string[],
                inactiveColors: string[]) {
        super(x, y);
        this.context = context;
        this.activeColors = activeColors;
        this.inactiveColors = inactiveColors;
    }

    public draw(): void {
        throw new Error('draw() method not provided in subclass of ' +
                        'AbstractMapPoint.');
    }

    protected getInnerColor(): string {
        return this.currentColors()[INNER_COLOR_IDX];
    }

    protected getRimColor(): string {
        return this.currentColors()[RIM_COLOR_IDX];
    }

    private currentColors(): string[] {
        return this.isActive ? this.activeColors : this.inactiveColors;
    }

}

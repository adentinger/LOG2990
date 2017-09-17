import { AbstractMapPoint } from './abstract-map-point';
import { NormalMapPointColorsActive } from './normal-map-point-colors-active';
import { NormalMapPointColorsInactive } from './normal-map-point-colors-inactive';

const INNER_RADIUS = 15.0;
const RIM_RADIUS   = 20.0;

export class NormalMapPoint extends AbstractMapPoint {

    constructor(context: CanvasRenderingContext2D,
                x: number,
                y: number) {
        super(context,
              x,
              y,
              new NormalMapPointColorsActive(),
              new NormalMapPointColorsInactive());
    }

    public draw(): void {
        this.context.beginPath();

        this.context.arc(this.x, this.y, RIM_RADIUS, 0, 2 * Math.PI);
        this.context.fillStyle = this.currentColors().getColorOf('rim');
        this.context.fill();

        this.context.arc(this.x, this.y, INNER_RADIUS, 0, 2 * Math.PI);
        this.context.fillStyle = this.currentColors().getColorOf('inner');
        this.context.fill();
    }

}

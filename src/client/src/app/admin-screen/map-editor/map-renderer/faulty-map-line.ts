import { AbstractMapLine } from './abstract-map-line';
import { Point } from '../point';
import { FaultyMapLineColors } from './faulty-map-line-colors';

const WIDTH = 5;

export class FaultyMapLine extends AbstractMapLine {

    constructor(context: CanvasRenderingContext2D,
                origin: Point,
                destination: Point) {
        super(context, origin, destination, new FaultyMapLineColors(), WIDTH);
    }

}

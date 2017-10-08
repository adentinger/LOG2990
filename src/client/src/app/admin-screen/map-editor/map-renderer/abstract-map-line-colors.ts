import { MapColors } from './map-colors';

export class AbstractMapLineColors extends MapColors {

    private line: string;

    constructor(lineColor: string) {
        super();
        this.line = lineColor;
    }

}

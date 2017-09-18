import { MapColors } from './map-colors';

export class AbstractMapLineColors extends MapColors {

    private line: string;

    constructor(line: string) {
        super();
        this.line = line;
    }

}

import { MapColors } from './map-colors';

export class AbstractFirstMapPointColors extends MapColors {

    private inner1: string;
    private inner2: string;
    private rim1: string;
    private rim2: string;

    constructor(inner1: string,
                inner2: string,
                rim1: string,
                rim2: string) {
        super();
        this.inner1 = inner1;
        this.inner2 = inner2;
        this.rim1 = rim1;
        this.rim2 = rim2;
    }

}

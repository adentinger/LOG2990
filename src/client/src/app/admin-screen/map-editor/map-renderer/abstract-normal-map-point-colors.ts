import { MapColors } from './map-colors';

export class AbstractNormalMapPointColors extends MapColors {

    private inner: string;
    private rim: string;

    constructor(inner: string,
                rim: string) {
        super();
        this.inner = inner;
        this.rim = rim;
    }

}

import { MapColors } from './map-colors';

const INNER_TOKEN = 'inner';
const RIM_TOKEN   = 'rim';

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

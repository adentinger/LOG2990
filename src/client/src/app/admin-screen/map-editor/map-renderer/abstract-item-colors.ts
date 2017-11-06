import { MapColors } from './map-colors';

export class AbstractItemColors extends MapColors {

    private disc: string;

    constructor(disc: string) {
        super();
        this.disc = disc;
    }

}

import { Item } from './item';

export class SpeedBoost implements Item {

    public type = 'speedBoost';
    public speedImpact = 2.0;
    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}

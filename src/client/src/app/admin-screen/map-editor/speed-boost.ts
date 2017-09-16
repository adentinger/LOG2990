import { Item } from './item';

export class SpeedBoost implements Item {
    public type = 'speedBoost';
    public speedImpact = 2.0;

    constructor(public position: number) {
        this.position = position;
    }
}

import { Item } from './item';

export class Puddle implements Item {
    public type = 'puddle';
    public speedImpact = 0.7;

    constructor(public position: number) {
        this.position = position;
    }
}

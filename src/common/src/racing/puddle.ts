import { Item } from './item';

export class Puddle implements Item {

    public type = 'puddle';
    public speedImpact = 0.7;
    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}

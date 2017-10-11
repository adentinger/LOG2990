import { Item } from './item';

export class Puddle implements Item {

    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}

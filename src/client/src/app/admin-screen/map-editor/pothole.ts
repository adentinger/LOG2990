import { Item } from './item';

export class Pothole implements Item {
    public type = 'pothole';
    public speedImpact = 0.5;

    constructor(public position: number) {
        this.position = position;
    }
}

import { Item } from './item';

export class Pothole implements Item {

    public type = 'pothole';
    public speedImpact = 0.5;
    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}

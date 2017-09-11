import {Point} from './point';

export class Map {
    public name: string;
    public type: string;
    public description: string;
    public points: Point[];

    constructor(name: string, type: string, description: string, points: Point[]) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.points = points;
    }
}

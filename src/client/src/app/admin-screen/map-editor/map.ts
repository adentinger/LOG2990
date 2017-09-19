import { Path } from './path';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';

export class Map {
    public path: Path;
    public potholes: Pothole[] = [];
    public puddles: Puddle[] = [];
    public speedBoosts: SpeedBoost[] = [];

    private name: string;
    private description: string;
    private type: string;
    private rating: number;
    private plays: number;
    public height: number;
    public width: number;

    constructor(path: Path = new Path(),
                name: string = '',
                description: string = '',
                type: string = 'Amateur',
                potholes: Pothole[] = [],
                puddles: Puddle[] = [],
                speedBoosts: SpeedBoost[] = [],
                rating: number = 0,
                plays: number = 0,
                height: number = 500,
                width: number = 500) {
        this.path = path;
        this.name = name;
        this.description = description;
        this.type = type;
        this.potholes.push.apply(this.potholes, potholes);
        this.puddles.push.apply(this.puddles, puddles);
        this.speedBoosts.push.apply(this.speedBoosts, speedBoosts);
        this.rating = rating;
        this.plays = plays;
        this.height = height;
        this.width = width;
    }
}

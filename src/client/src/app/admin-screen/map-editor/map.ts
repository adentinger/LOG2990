import { Path } from './path';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';

export class Map {
    public potholes: Pothole[] = [];
    public puddles: Puddle[] = [];
    public speedBoosts: SpeedBoost[] = [];

    constructor(public path: Path = new Path(),
                public name: string = '',
                public description: string = '',
                public type: string = 'Amateur',
                potholes: Pothole[] = [],
                puddles: Puddle[] = [],
                speedBoosts: SpeedBoost[] = [],
                public rating: number = 0,
                public plays: number = 0,
                public height: number = 500,
                public width: number = 500) {
        this.potholes.push.apply(this.potholes, potholes);
        this.puddles.push.apply(this.puddles, puddles);
        this.speedBoosts.push.apply(this.speedBoosts, speedBoosts);
    }
}

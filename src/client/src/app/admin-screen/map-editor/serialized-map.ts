import { Point } from '../../common/math/point';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';

// This class is meant to be used as a container object that can be
// sent to / retrieved from a database via a web service. Do NOT add any
// methods to this class.

export class SerializedMap {

    public name: string;
    public description: string;
    public type: string;
    public sumRatings: number;
    public numberOfRatings: number;
    public numberOfPlays: number;

    public points: Point[];
    public potholes: Pothole[];
    public puddles: Puddle[];
    public speedBoosts: SpeedBoost[];

    public constructor(name: string = '',
                       description: string = '',
                       type: string = 'Amateur',
                       sumRatings: number = 0,
                       numberOfRatings: number = 0,
                       numberOfPlays: number = 0,
                       points: Point[] = [],
                       potholes: Pothole[] = [],
                       puddles: Puddle[] = [],
                       speedBoosts: SpeedBoost[] = []) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.sumRatings = sumRatings;
        this.numberOfRatings = numberOfRatings;
        this.numberOfPlays = numberOfPlays;
        this.points = points;
        this.potholes = potholes;
        this.puddles = puddles;
        this.speedBoosts = speedBoosts;
    }

}

import { Point } from './point';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';

// This class is meant to be used as a container object that can be
// sent to / retrieved from a database via a web service. Do NOT add any
// methods to this class.

export class SerializedMap {

    // TODO Move the classes here, instead of using 'any'.

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

}

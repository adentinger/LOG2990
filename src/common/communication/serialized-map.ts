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

    public points: any[];
    public potholes: any[];
    public puddles: any[];
    public speedBoosts: any[];

}

export class Interval {

    private lowerBound: number;
    private upperBound: number;

    constructor(firstBound: number, secondBound: number) {
        if (firstBound < secondBound) {
            this.lowerBound = firstBound;
            this.upperBound = secondBound;
        }
        else {
            this.lowerBound = secondBound;
            this.lowerBound = firstBound;
        }
    }

    public get lower(): number {
        return this.lowerBound;
    }

    public get upper(): number {
        return this.upperBound;
    }

    public contains(value: number): boolean {
        return value >= this.lowerBound
            && value <= this.upperBound;
    }

}

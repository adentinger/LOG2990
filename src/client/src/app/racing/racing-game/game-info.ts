import { Car } from './models/car/car';
import { Seconds } from '../../types';
import { CarsService } from './cars.service';

export class GameInfo {

    public maxLap = 3;

    private startTime: Seconds;
    private lapTimesInternal = new Array(this.maxLap).fill(0);

    public get lap(): number {
        return 1;
    }

    public getPositions(car: Car) {
        return null;
    }

    public get lapTimes(): Seconds[] {
        this.lapTimesInternal[this.lap - 1] = Date.now() / 1000 - this.startTime;
        return this.lapTimesInternal;
    }

    public get totalTime(): Seconds {
        return Date.now() / 1000 - this.startTime;
    }

    public get controlledCar(): Car {
        return this.carsService.getPlayerCar();
    }

    constructor(private carsService: CarsService) { }

    public startTimer(): void {
        this.startTime = Date.now() / 1000;
    }
}

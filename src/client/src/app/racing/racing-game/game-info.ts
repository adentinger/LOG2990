import { Car } from './models/car/car';
import { Seconds } from '../../types';
import { CarsService } from './cars.service';
import { Progression } from './racing-types';
import { CarsProgressionService } from './cars-progression.service';

export class GameInfo {

    public maxLap = 3;

    private startTime: Seconds;
    private lapTimesInternal = new Array(this.maxLap).fill(0);

    public get lap(): number {
        return 1;
    }

    public getPosition(car: Car): Progression {
        return 0;
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

    constructor(
        private carsService: CarsService,
        private carsProgressionService: CarsProgressionService) { }

    public startTimer(): void {
        this.startTime = Date.now() / 1000;
    }

    public getCurrentRank(): number {
        // TODO fetch from carsService
        return 1;
    }
}

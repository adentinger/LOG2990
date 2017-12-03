import { Car } from './models/car/car';
import { Seconds } from '../../types';
import { CarsService } from './cars.service';
import { CarsProgressionService, CAR_LAP_UPDATE_EVENT, LapUpdateInfo } from './cars-progression.service';
import { EventManager } from '../../event-manager.service';
import { GAME_COMPLETED_EVENT, USER_INDEX } from '../constants';
import { UserCarController } from './physic/ai/user-car-controller';

export class GameInfo {

    public maxLap = 3;

    private startTime: Seconds;

    private lapTimesTable: Map<Car, Seconds[]> = new Map(); // reduce pour total

    public get userLapCompletionInPercent(): number {
        return this.carsProgressionService.userLapProgressionInPercent;
    }

    public get userLapNumber(): number {
        return this.carsProgressionService.userLapsCount;
    }

    public get userLapTimes(): Seconds[] {
        return this.lapTimesTable.get(this.carsService.getPlayerCar());
    }

    public get totalTime(): Seconds {
        return Date.now() / 1000 - this.startTime;
    }

    public get controlledCar(): Car {
        return this.carsService.getPlayerCar();
    }

    public get currentRank(): number {
        return this.carsProgressionService.computeUserRank();
    }

    constructor(
        private carsService: CarsService,
        private carsProgressionService: CarsProgressionService,
        private eventManager: EventManager) {
        this.carsService.cars.forEach((car) => {
            this.lapTimesTable.set(car, [0]);
        });
        eventManager.registerClass(this, GameInfo.prototype);
    }

    public startTimer(delay: Seconds = 0): void {
        this.startTime = Date.now() / 1000 + delay;
        this.carsService.cars.forEach((car) => {
            this.lapTimesTable.set(car, [this.startTime]);
        });
    }

    @EventManager.Listener(CAR_LAP_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private updateRaceResultTimeTable(event: EventManager.Event<LapUpdateInfo>) {
        this.lapTimesTable.get(event.data.car).push(Date.now() / 1000);
    }
}

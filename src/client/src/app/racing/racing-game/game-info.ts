import { Car } from './models/car/car';
import { Seconds } from '../../types';

export interface GameInfo {
    lap: number;
    maxLap: number;
    positions: Car[];
    lapTimes: Seconds[];
    totalTime: Seconds;
    startTime: Seconds;
    controlledCar: Car;
}

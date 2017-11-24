import { Car } from '../../models/car/car';
import { Line } from '../../../../../../../common/src/math';

export enum CarControllerState {
    DISABLED,
    ENABLED
}

export abstract class CarController {
    protected state = CarControllerState.DISABLED;
    protected readonly trackLines: Line[] = [];

    public constructor(public readonly car: Car) {
        car.targetSpeed = 0;
        car.targetAngularSpeed = 0;
    }

    public start(): void {
        this.state = CarControllerState.ENABLED;
    }

    public stop(): void {
        if (this.state === CarControllerState.ENABLED) {
            this.car.targetSpeed = 0;
            this.car.targetAngularSpeed = 0;
        }
        this.state = CarControllerState.DISABLED;
    }

    public setTrackLines(lines: Line[]): void {
        this.trackLines.splice(0); // clear array
        this.trackLines.push(...lines);
    }
}

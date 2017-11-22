import { Car } from '../../models/car/car';
import { EventManager } from '../../../../event-manager.service';

export enum CarControllerState {
    DISABLED,
    ENABLED
}

export abstract class CarController {
    protected state = CarControllerState.DISABLED;

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
}

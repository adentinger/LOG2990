import { Car } from '../../models/car/car';
import { EventManager } from '../../../../event-manager.service';

export enum CarControllerState {
    DISABLED,
    ENABLED
}

export abstract class CarController {
    protected state = CarControllerState.DISABLED;

    public constructor(public readonly car: Car) { }

    public start(): void {
        this.state = CarControllerState.ENABLED;
    }

    public stop(): void {
        this.state = CarControllerState.DISABLED;
    }
}

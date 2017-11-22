import { Car } from '../../models/car/car';
import { EventManager } from '../../../../event-manager.service';
import { BEFORE_PHYSIC_UPDATE_EVENT } from '../engine';

export enum CarControllerState {
    DISABLED,
    ENABLED
}

export abstract class CarController {
    public constructor(public readonly car: Car) { }

    public abstract start(): void;
    public abstract stop(): void;
}

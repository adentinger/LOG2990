import { Car } from '../../models/car/car';
import { EventManager } from '../../../../event-manager.service';
import { BEFORE_PHYSIC_UPDATE_EVENT } from '../engine';

export abstract class CarController {
    public constructor(protected controlledCar: Car) { }

    public start(): void { }
    public stop(): void { }

    @EventManager.Listener(BEFORE_PHYSIC_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private updateControls(): void { }
}

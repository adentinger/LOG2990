import { CarController } from './car-controller';
import { Car } from '../../models/car/car';
import { EventManager } from '../../../../event-manager.service';
import { Seconds } from '../../../../types';
import { AFTER_PHYSIC_UPDATE_EVENT } from '../engine';

export class AiCarController extends CarController {
    private static readonly UPDATE_PERIODE = 5; // cycles

    private cycleCount = 0;

    public constructor(car: Car) {
        super(car);
        EventManager.getInstance().registerClass(this, AiCarController.prototype);
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onAfterPhysicUpdate(event: EventManager.Event<{deltaTime: Seconds}>): void {
        if (++this.cycleCount >= AiCarController.UPDATE_PERIODE) {
            this.cycleCount = 0;
            // Call the physic updates.
        }
    }
}

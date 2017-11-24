import { Injectable } from '@angular/core';
import { EventManager } from '../../event-manager.service';
import { AFTER_PHYSIC_UPDATE_EVENT } from './physic/engine';
import { Seconds } from '../../types';
import { CarController } from './physic/ai/car-controller';
import { Car } from './models/car/car';
import { Line } from '../../../../../common/src/math/line';
import { Progression } from './racing-types';
import { Projection } from '../../util/projection';
import { MapPositionAlgorithms } from '../../util/map-position-algorithms';
import { Point } from '../../../../../common/src/math/point';

@Injectable()
/**
 * Keeps Track of the cars progression relative to the map
 * (On a linear scale)
 */
export class CarsProgressionService {
    private progressionUpdateCounter = 0;

    private controllers: CarController[] = [];
    private mapLines: Line[];

    public constructor(private eventManager: EventManager) {
        eventManager.registerClass(this);
    }

    public initialize(controllers: CarController[], mapLines: Line[]): void {

    }

    public computeUserRank(): number {
        return 1;
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    private updateCarsProgression(event: EventManager.Event<{ deltaTime: Seconds }>): void {
        if (++this.progressionUpdateCounter === 30) {
            this.progressionUpdateCounter = 0;
            // for (const controller of this.controllers) {
            //     this.carsProgression.set(controller.car, this.computeCarProgression(controller.car, this.mapLines);
            // }
            // this.carsProgression.forEach((prog) => {
            //     console.log(prog);
            // });
        }
    }

    private computeCarProgression(car: Car, mapLines: Line[]): Progression {
        const projection: Projection = MapPositionAlgorithms.getClosestProjection(new Point(car.position.x, car.position.y), mapLines);
        let progression: Progression = 0;
        for (let i = 0; i < mapLines.length; ++i) {
            if (projection.segment === mapLines[i]) {
                progression += i;
            }
        }
        progression += projection.interpolation;
        return progression;
    }
}

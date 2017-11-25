import { Injectable } from '@angular/core';
import { EventManager } from '../../event-manager.service';
import { AFTER_PHYSIC_UPDATE_EVENT } from './physic/engine';
import { Seconds } from '../../types';
import { CarController } from './physic/ai/car-controller';
import { Car } from './models/car/car';
import { Line } from '../../../../../common/src/math/line';
import { Progression, LapProgression } from './racing-types';
import { Projection } from '../../util/projection';
import { MapPositionAlgorithms } from '../../util/map-position-algorithms';
import { Point } from '../../../../../common/src/math/point';
import { UserCarController } from './physic/ai/user-car-controller';

enum LapState {
    firstHalf,
    secondHalf,
}

@Injectable()
/**
 * Keeps Track of the cars progression relative to the map
 * (On a linear scale)
 */
export class CarsProgressionService {
    private progressionUpdateCounter = 0;

    private carProgressions: Map<Car, Progression> = new Map();
    private carLapStates: Map<Car, LapState> = new Map();
    private controllers: CarController[] = [];
    private mapLines: Line[];
    private mapLength: number;
    private userCar: Car;

    public constructor(private eventManager: EventManager) {
        eventManager.registerClass(this);
    }

    public initialize(controllers: CarController[], mapLines: Line[]): void {
        this.mapLength = mapLines.map((line) => line.length).reduce((sum, val) => sum + val);
        this.controllers = controllers;
        for (const controller of controllers) {
            this.carProgressions.set(controller.car, 0);
            this.carLapStates.set(controller.car, 0);
            if (controller instanceof UserCarController) {
                this.userCar = controller.car;
            }
        }
    }

    public computeUserRank(): number {
        return 1;
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    private updateCarsProgression(event: EventManager.Event<{ deltaTime: Seconds }>): void {
        if (++this.progressionUpdateCounter === 30) {
            this.progressionUpdateCounter = 0;
            //
        }
    }

    private computeCurrentLap(car: Car): number {
        return 0;
    }

    private computeLapProgression(car: Car): LapProgression {
        let progression: LapProgression = 0;
        const projection: Projection = MapPositionAlgorithms.getClosestProjection(
            new Point(car.position.x, car.position.y), this.mapLines);

        const currentSegment: number = this.mapLines.indexOf(projection.segment);

        // Add completed segments
        for (let i = 0; i < currentSegment; ++i) {
            progression += this.mapLines[i].length;
        }

        // Add fraction of current segment
        progression += this.mapLines[currentSegment].length * projection.interpolation;

        // Divide by map length to get a [0,1) value
        progression /= this.mapLength;

        return progression;
    }
}

import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Car } from './models/car/car';
import { RacingGameService } from './racing-game.service';
import { Point } from '../../../../../common/src/math/point';
import { Line } from '../../../../../common/src/math/line';

@Injectable()
export class CarsPositionsService {
    private carsInternal: Car[];
    private mapPoints: Point[];
    private lines: Line[];

    public initialize(cars: Car[]) {
        this.carsInternal = cars;

        // setInterval(() => console.log(this.playerCoordinates), 3000);
    }

    public get playerCoordinates(): THREE.Vector {
        return this.carsInternal[RacingGameService.DEFAULT_CONTROLLABLE_CAR_IDX].position;
    }

    public getPlayerProgressionInPercent(): number {
        return 0;
    }

    private getMapLength(): number {
        return 0; // MOCK
    }
}

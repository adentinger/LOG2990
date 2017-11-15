import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Car } from './models/car/car';
import { RacingGameService } from './racing-game.service';

@Injectable()
export class CarsPositionsService {
    private carsInternal: Car[];

    public initialize(cars: Car[]) {
        this.carsInternal = cars;
        setInterval(() => console.log(this.playerCoordinates), 3000);
    }

    public get playerCoordinates(): THREE.Vector {
        return this.carsInternal[RacingGameService.DEFAULT_CONTROLLABLE_CAR_IDX].position;
    }
}

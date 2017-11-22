import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Car } from './models/car/car';
import { RacingGameService } from './racing-game.service';
import { Point } from '../../../../../common/src/math/point';
import { Line } from '../../../../../common/src/math/line';
import { GameInfo } from './game-info';
import { SoundService } from '../services/sound-service';
import { Loadable } from '../../loadable';
import { RenderableMap } from './racing-game-map/renderable-map';


@Injectable()
export class CarsService implements Loadable {

    public static readonly CAR_COUNT = 4;

    private controlledCarIdx = Math.floor(Math.random() * CarsService.CAR_COUNT);
    public readonly waitToLoad: Promise<void>;

    private readonly cars: Car[] = [
        new Car(new THREE.Color('green')),
        new Car(new THREE.Color('yellow')),
        new Car(new THREE.Color('blue')),
        new Car(new THREE.Color('red'))
    ];

    public constructor() {
        this.waitToLoad = Promise.all([
            ...this.cars.map(car => car.waitToLoad)
        ]).then(() => { });
    }

    public initialize(soundService: SoundService) {
        this.cars.forEach(soundService.registerEmitter, soundService);
    }

    public finalize() {
        this.cars.forEach(car => {
            car.stopSounds();
            car.removeUIInput();
        });
    }

    public get playerCoordinates(): THREE.Vector {
        return this.getPlayerCar().position;
    }

    public getPlayerProgressionInPercent(): number {
        return 0;
    }

    private getMapLength(): number {
        return 0; // MOCK
    }

    public getPlayerCar(): Car {
        return this.cars[this.controlledCarIdx];
    }

    public addToMap(map: RenderableMap): void {
        map.addCars(...this.cars);
    }

    public removeFromMap(map: RenderableMap): void {
        this.cars.forEach(map.remove, map);
    }
}

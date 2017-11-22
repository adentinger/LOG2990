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
import { Progression } from './racing-types';
import { EventManager } from '../../event-manager.service';
import { Seconds } from '../../types';
import { AFTER_PHYSIC_UPDATE_EVENT } from './physic/engine';


@Injectable()
export class CarsService implements Loadable {

    public static readonly CAR_COUNT = 4;

    public readonly waitToLoad: Promise<void>;

    private readonly carsProgression: Map<Car, Progression> = new Map();
    private progressionUpdateCounter = 0;

    private readonly cars: Set<Car> = new Set([
        new Car(new THREE.Color('green')),
        new Car(new THREE.Color('yellow')),
        new Car(new THREE.Color('blue')),
        new Car(new THREE.Color('red'))
    ]);

    private controlledCar = Array.from(
        this.cars.values())[Math.floor(Math.random() * CarsService.CAR_COUNT)];

    public constructor() {
        this.waitToLoad = Promise.all([
            ...Array.from(this.cars.values(), car => car.waitToLoad)
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

    public getCarsProgression(): Map<Car, Progression> {
        return this.carsProgression;
    }

    private getMapLength(): number {
        return 0; // MOCK
    }

    public getPlayerCar(): Car {
        return this.controlledCar;
    }

    public addToMap(map: RenderableMap): void {
        map.addCars(...this.cars);
    }

    public removeFromMap(map: RenderableMap): void {
        this.cars.forEach(map.remove, map);
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    private updateCarsProgression(event: EventManager.Event<{ deltaTime: Seconds }>): void {
        if (++this.progressionUpdateCounter === 30) {
            this.progressionUpdateCounter = 0;
            // compute progressions
            // function call
        }
    }
}

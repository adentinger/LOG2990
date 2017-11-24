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
import { CarController } from './physic/ai/car-controller';
import { UserCarController } from './physic/ai/user-car-controller';
import { AiCarController } from './physic/ai/ai-car-controller';
import { UIInputs } from '../services/ui-input.service';
import { MapPositionAlgorithms } from '../../util/map-position-algorithms';
import { Projection } from '../../util/projection';


@Injectable()
export class CarsService implements Loadable {

    public static readonly CAR_COUNT: number = 4;

    private static readonly CAR_COLORS: THREE.Color[] = [
        new THREE.Color('green'),
        new THREE.Color('yellow'),
        new THREE.Color('blue'),
        new THREE.Color('red')];

    public readonly waitToLoad: Promise<void>;

    private readonly carsProgression: Map<Car, Progression> = new Map();
    private readonly controllers: CarController[] = [];

    private progressionUpdateCounter = 0;
    private userControllerIndex: number = Math.floor(Math.random() * CarsService.CAR_COUNT);
    private mapLines: Line[];

    public get cars(): Car[] {
        return this.controllers.map((controller) => controller.car);
    }

    public constructor(eventManager: EventManager) {
        for (let index = 0; index < CarsService.CAR_COUNT; ++index) {
            this.controllers.push(index === this.userControllerIndex ?
                new UserCarController(new Car(CarsService.CAR_COLORS[index])) :
                new AiCarController(new Car(CarsService.CAR_COLORS[index])));

            this.carsProgression.set(this.controllers[index].car, 0);
        }

        this.waitToLoad = Promise.all(
            this.controllers.map((controller) => controller.car.waitToLoad)
        ).then(() => { });

        eventManager.registerClass(this);
    }

    public initialize(soundService: SoundService, userInput: UIInputs, mapLines: Line[]) {
        this.cars.forEach(soundService.registerEmitter, soundService);
        (this.controllers[this.userControllerIndex] as UserCarController).setUIInput(userInput);
        this.controllers.forEach(controller => controller.setTrackLines(mapLines));
        this.mapLines = mapLines;
    }

    public finalize() {
        this.controllers.map((controller) => {
            if (controller instanceof UserCarController) {
                controller.removeUIInput();
            }
            controller.stop();
            return controller.car;
        }).forEach(car => {
            car.stopSounds();
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
        return this.controllers[this.userControllerIndex].car;
    }

    public addToMap(map: RenderableMap): void {
        map.addCars(...this.cars);
    }

    public removeFromMap(map: RenderableMap): void {
        this.cars.forEach(map.remove, map);
    }

    public startControllers(): void {
        this.controllers.forEach(controller => controller.start());
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    private updateCarsProgression(event: EventManager.Event<{ deltaTime: Seconds }>): void {
        if (++this.progressionUpdateCounter === 30) {
            this.progressionUpdateCounter = 0;
            for (const controller of this.controllers) {
                this.carsProgression.set(controller.car, this.computeCarProgression(controller.car, this.mapLines));
            }
            this.carsProgression.forEach((prog) => {
                console.log(prog);
            });
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

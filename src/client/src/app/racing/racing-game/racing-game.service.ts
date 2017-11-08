import { Injectable } from '@angular/core';
import * as THREE from 'three';

import { RacingRenderer } from './rendering/racing-renderer';
import { PhysicEngine } from './physic/engine';
import { RenderableMap } from './racing-game-map/renderable-map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { DayMode } from './day-mode/day-mode-manager';
import { UIInputs } from '../services/ui-input.service';
import { Car } from './models/car/car';
import { EventManager } from '../../event-manager.service';
import { MapService } from '../services/map.service';
import { MockSerializedMaps } from '../../../../../common/src/racing/mock-serialized-maps';
import { BoostBox } from './physic/examples/boost-box';
import { PuddleBox, SlipDirection } from './physic/examples/puddle-box';
import { Seconds } from '../types';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RacingGameService {
    public static readonly CONTROLLABLE_CAR_IDX = 1;
    private static readonly DEFAULT_MAP_DEV = new MockSerializedMaps().functional2();

    public readonly renderer: RacingRenderer;
    private readonly cars: Car[] = [
        new Car(new THREE.Color('green')),
        new Car(new THREE.Color('yellow')),
        new Car(new THREE.Color('blue')),
        new Car(new THREE.Color('red'))
    ];
    public readonly waitToLoad: Promise<void>;
    public readonly waitToFinalize: Observable<void>;
    private readonly finalizeSubject = new Subject<void>();
    private readonly boxes;

    private startTime: Seconds;
    private lapTimesInternal = new Array(this.maxLap).fill(0);

    private map: RenderableMap;

    public get controlledCar(): Car {
        return this.cars[RacingGameService.CONTROLLABLE_CAR_IDX];
    }

    public get lap(): number {
        // Mocked
        return 1;
    }

    public get maxLap(): number {
        // Mocked
        return 3;
    }

    public get positions(): Car[] {
        // Mocked
        return this.cars;
    }

    public get lapTimes(): Seconds[] {
        this.lapTimesInternal[this.lap - 1] = Date.now() / 1000 - this.startTime;
        return this.lapTimesInternal;
    }

    public get totalTime(): Seconds {
        return Date.now() / 1000 - this.startTime;
    }

    public get dayMode(): DayMode {
        return this.renderer.dayMode;
    }

    constructor(private physicEngine: PhysicEngine,
        private mapService: MapService,
        eventManager: EventManager) {
        this.waitToLoad = Promise.all(this.cars.map(car => car.waitToLoad)).then(() => { });
        this.waitToFinalize = this.finalizeSubject.asObservable();
        this.renderer = new RacingRenderer(eventManager, this);
        this.boxes = [
            new BoostBox(eventManager).translateZ(-3),
            new PuddleBox(eventManager, SlipDirection.RIGHT).translateZ(-10)
        ];
    }

    public initialise(container: HTMLDivElement, hudCanvas: HTMLCanvasElement, userInputs: UIInputs): void {
        this.renderer.initialize(container, hudCanvas);

        const userCar = this.cars[RacingGameService.CONTROLLABLE_CAR_IDX];
        userCar.setUIInput(userInputs);
        this.renderer.setCamerasTarget(userCar);
        this.reloadSounds();

        this.renderer.updateDayMode(RacingRenderer.DEFAULT_DAYMODE);

        // If the game is stopping before it was loaded, then don't start anything.
        Promise.race([
            this.waitToLoad,
            this.waitToFinalize.toPromise().then(() => {throw void(0); })
        ]).then(() => {
            this.physicEngine.start();
            this.renderer.startRendering();
            this.startTime = Date.now() / 1000;
        }, () => console.log('Initialization interrupted'));
    }

    public finalize() {
        this.finalizeSubject.next(); // Notify that the game (forcefully) Stops

        this.physicEngine.stop();
        this.renderer.stopRendering();

        this.cars.forEach(car => {
            car.stopSounds();
            car.removeUIInput();
        });

        this.physicEngine.finalize();
        this.renderer.finalize();
    }

    public loadMap(mapName: string): Promise<void> {
        return this.mapService.getByName(mapName)
            .then(map => this.setMap(map))
            .catch(() => this.setMap(RacingGameService.DEFAULT_MAP_DEV));
    }

    private setMap(map: SerializedMap): Promise<void> {
        if (this.map) {
            this.cars.forEach(this.map.remove, this.map);
            this.boxes.forEach(this.map.remove, this.map);
            this.renderer.removeMap(this.map);
        }

        this.map = new RenderableMap(map);
        this.physicEngine.initialize(this.map);
        this.renderer.addMap(this.map);

        this.map.addCars(...this.cars);
        this.map.add(...this.boxes);
        return Promise.all([this.map.waitToLoad]).then(() => {});
    }

    public getCars(): Car[] {
        return Array.from(this.cars);
    }

    public updateRendererSize(width: number, height: number) {
        this.renderer.updateSize(width, height);
    }

    public reloadSounds() {
        this.cars.forEach(car => {
            car.stopSounds();
            car.startSounds();
        });
    }

    public toggleDayMode(): void {
        this.renderer.toggleDayMode();
    }

}

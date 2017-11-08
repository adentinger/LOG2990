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
import { RacetrackSegment } from './three-objects/racetrack/racetrack-segment';
import { RacetrackJunction } from './three-objects/racetrack/racetrack-junction';
import { BoostBox } from './physic/examples/boost-box';
import { PuddleBox, SlipDirection } from './physic/examples/puddle-box';
import { Seconds } from '../types';

@Injectable()
export class RacingGameService {
    private static readonly CONTROLLABLE_CAR_IDX = 1;
    private static readonly DEFAULT_MAP_DEV = new MockSerializedMaps().functional2();

    public readonly renderer: RacingRenderer;
    private dayModeInternal: DayMode = DayMode.DAY;
    private cars: Car[] = [
        new Car(new THREE.Color('green')),
        new Car(new THREE.Color('yellow')),
        new Car(new THREE.Color('blue')),
        new Car(new THREE.Color('red'))
    ];
    private readonly boxes;

    private map: RenderableMap;
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

    public get lapTimes(): number[] {
        // Mocked
        return [].fill(0, 0, this.maxLap);
    }

    public get totalTime(): Seconds {
        // Mocked
        return 0;
    }

    public get dayMode(): DayMode {
        return this.dayModeInternal;
    }

    constructor(private physicEngine: PhysicEngine,
        private mapService: MapService,
        eventManager: EventManager) {
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
        this.physicEngine.start();
        this.renderer.startRendering();
        this.renderer.updateDayMode(this.dayModeInternal);
    }

    public finalize() {
        this.physicEngine.stop();
        this.renderer.stopRendering();
        this.cars.forEach(car => {
            car.stopSounds();
            car.removeUIInput();
        });

        this.renderer.finalize();
    }

    public loadMap(mapName: string): Promise<void> {
        return this.mapService.getByName(mapName)
            .then(map => this.setMap(map))
            .catch(() => this.setMap(RacingGameService.DEFAULT_MAP_DEV));
    }

    private setMap(map: SerializedMap): void {
        if (this.map) {
            this.cars.forEach(this.map.remove, this.map);
            this.boxes.forEach(this.map.remove, this.map);
            this.renderer.removeMap(this.map);
        }

        this.map = new RenderableMap(map);
        this.physicEngine.setRoot(this.map);
        this.renderer.addMap(this.map);

        this.map.addCars(...this.cars);
        this.map.add(...this.boxes);
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

    public changeDayMode(): void {
        let newMode: DayMode;
        switch (this.dayModeInternal) {
            case DayMode.DAY: newMode = DayMode.NIGHT; break;
            case DayMode.NIGHT: newMode = DayMode.DAY; break;
            default: break;
        }
        this.dayModeInternal = newMode;
        this.renderer.updateDayMode(this.dayModeInternal);
    }

}

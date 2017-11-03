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

@Injectable()
export class RacingGameService {
    private static readonly CONTROLLABLE_CAR_IDX = 2;
    private static readonly DEFAULT_MAP_DEV = new MockSerializedMaps().functional1();

    public readonly renderer: RacingRenderer;
    private dayMode: DayMode = DayMode.DAY;
    private cars: Car[] = [
        new Car(new THREE.Color('green')),
        new Car(new THREE.Color('yellow')),
        new Car(new THREE.Color('blue')),
        new Car(new THREE.Color('red'))
    ];

    private map: RenderableMap;

    constructor(private physicEngine: PhysicEngine,
        private mapService: MapService,
        eventManager: EventManager) {
        this.renderer = new RacingRenderer(eventManager);
    }

    public initialise(container: HTMLDivElement, userInputs: UIInputs): void {
        this.renderer.initialize(container);

        const userCar = this.cars[RacingGameService.CONTROLLABLE_CAR_IDX];
        userCar.setUIInput(userInputs);
        this.renderer.setCamerasTarget(userCar);

        const position = new THREE.Vector3();
        const positionIncrement = new THREE.Vector3(2, 0, 0);
        this.cars.forEach((car) => {
            car.position.copy(position);
            position.add(positionIncrement);
        });

        // racetrack segments
        const segment1 = new RacetrackSegment();
        this.map.add(segment1);

        this.physicEngine.start();
        this.renderer.startRendering();
        this.renderer.updateDayMode(this.dayMode);
    }

    public finalize() {
        this.physicEngine.stop();
        this.renderer.stopRendering();

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
            this.renderer.removeMap(this.map);
        }

        this.map = new RenderableMap(map);
        this.physicEngine.setRoot(this.map);
        this.renderer.addMap(this.map);

        this.map.add(...this.cars);
    }

    public updateRendererSize(width: number, height: number) {
        this.renderer.updateSize(width, height);
    }

    public changeDayMode(): void {
        let newMode: DayMode;
        switch (this.dayMode) {
            case DayMode.DAY: newMode = DayMode.NIGHT; break;
            case DayMode.NIGHT: newMode = DayMode.DAY; break;
            default: break;
        }
        this.dayMode = newMode;
        this.renderer.updateDayMode(this.dayMode);
    }

}

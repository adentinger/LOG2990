import { Injectable } from '@angular/core';
import * as THREE from 'three';

import { RacingRenderer } from './rendering/racing-renderer';
import { PhysicEngine } from './physic/engine';
import { RenderableMap } from './racing-game-map/renderable-map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { DayMode } from './day-mode/day-mode-manager';
import { UIInputs, KEYDOWN_EVENT } from '../services/ui-input.service';
import { Car } from './models/car/car';
import { EventManager } from '../../event-manager.service';
import { MapService } from '../services/map.service';
import { Seconds } from '../../types';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Logger } from '../../../../../common/src/logger';
import { SoundService } from '../services/sound-service';
import { Sound } from '../services/sound';
import { CarsPositionsService } from './cars-positions.service';
import { CarController } from './physic/ai/car-controller';
import { UserCarController } from './physic/ai/user-car-controller';
import { AiCarController } from './physic/ai/ai-car-controller';

const logger = Logger.getLogger();

export const GAME_START_EVENT = 'racing-start';

@Injectable()
export class RacingGameService {
    public static readonly DEFAULT_CONTROLLABLE_CAR_IDX = 2;

    public readonly renderer: RacingRenderer;
    protected controlledCarIdx = RacingGameService.DEFAULT_CONTROLLABLE_CAR_IDX;
    private readonly cars: Car[] = [
        new Car(new THREE.Color('green')),
        new Car(new THREE.Color('yellow')),
        new Car(new THREE.Color('blue')),
        new Car(new THREE.Color('red'))
    ];
    private readonly controllers: CarController[] = this.cars.map((car, idx) =>
        idx === this.controlledCarIdx ? new UserCarController(car) : new AiCarController(car));
    public readonly waitToLoad: Promise<void>;
    public readonly waitToFinalize: Observable<void>;
    private readonly finalizeSubject = new Subject<void>();

    private startTime: Seconds;
    private lapTimesInternal = new Array(this.maxLap).fill(0);
    private maxLapInternal = 3;

    private map: RenderableMap;

    private userInputs: UIInputs = null;

    public get controlledCar(): Car {
        return this.cars[this.controlledCarIdx];
    }

    public get lap(): number {
        // Mocked
        return 1;
    }

    public get maxLap(): number {
        return this.maxLapInternal;
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
        private eventManager: EventManager,
        private soundService: SoundService,
        private carsPositionsService: CarsPositionsService) {
        this.waitToLoad = Promise.all([
            ...this.cars.map(car => car.waitToLoad),
            this.soundService.waitToLoad
        ]).then(() => { });
        this.waitToFinalize = this.finalizeSubject.asObservable();
        this.renderer = new RacingRenderer(eventManager, this);
        eventManager.registerClass(this);
        this.carsPositionsService.initialize(this);
    }

    public initialize(container: HTMLDivElement, hudCanvas: HTMLCanvasElement, userInputs: UIInputs): void {
        this.renderer.initialize(container, hudCanvas);
        this.soundService.initialize(this.renderer.getBothCameras()[0]);
        this.userInputs = userInputs;

        const userCarController = this.controllers[this.controlledCarIdx] as UserCarController;
        userCarController.setUIInput(userInputs);
        this.renderer.setCamerasTarget(userCarController.car);

        this.controllers.forEach(controller => controller.setTrackLines(this.map.mapLines));
        this.reloadSounds();

        this.cars.forEach(this.soundService.registerEmitter, this.soundService);

        this.renderer.updateDayMode(RacingRenderer.DEFAULT_DAYMODE);

        // If the game is stopping before it was loaded, then don't start anything.
        Promise.race([
            this.waitToLoad,
            this.waitToFinalize.toPromise().then(() => { throw void (0); })
        ]).then(() => {
            this.physicEngine.start();
            this.renderer.startRendering();
            this.startTime = Date.now() / 1000;
            this.soundService.setAbmiantSound(Sound.START_SOUND);
            this.waitToLoad.then(() => this.soundService.playAmbiantSound(false))
                .then(() => {
                    const event: EventManager.Event<void> = {name: GAME_START_EVENT, data: void 0};
                    this.eventManager.fireEvent(event.name, event);
                    return this.soundService.setAbmiantSound(Sound.TETRIS);
                }).then(() => {
                    this.soundService.playAmbiantSound(true);
                    this.controllers.forEach(controller => controller.start());
                });
        }, () => logger.warn('Initialization interrupted'));
    }

    public finalize() {
        this.finalizeSubject.next(); // Notify that the game (forcefully) Stops

        this.physicEngine.stop();
        this.renderer.stopRendering();

        this.cars.forEach(car => {
            car.stopSounds();
        });
        this.controllers.forEach((controller, idx) => {
            controller.stop();
            if (controller instanceof UserCarController) {
                controller.removeUIInput();
            }
        });

        this.userInputs = null;

        this.physicEngine.finalize();
        this.renderer.finalize();
        this.soundService.finalize();
    }

    public loadMap(mapName: string): Promise<void> {
        return this.mapService.getByName(mapName)
            .then(map => this.setMap(map));
    }

    private setMap(map: SerializedMap): Promise<void> {
        if (this.map) {
            this.cars.forEach(this.map.remove, this.map);
            this.renderer.removeMap(this.map);
        }

        this.map = new RenderableMap(map, this.eventManager);
        this.physicEngine.initialize(this.map);
        this.renderer.addMap(this.map);

        this.map.addCars(...this.cars);
        return this.map.waitToLoad.then(() => { });
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

    /**
     * ghostMode
     */
    public ghostMode() {
        //
    }

    public toggleDayMode(): void {
        this.renderer.toggleDayMode();
    }

    @EventManager.Listener(KEYDOWN_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private changeMaxLap(event: EventManager.Event<KeyboardEvent>) {
        // keys from '1' to '9'
        const MIN = 1, MAX = 9;
        const keysArray = new Array(MIN + MAX - 1).fill(0).map((dummy, index) => (index + MIN).toString());
        const keys = new Set(keysArray);

        if (this.userInputs && keys.has(event.data.key) && this.userInputs.isKeyPressed(event.data.key)) {
            this.maxLapInternal = +event.data.key;
        }
    }

}

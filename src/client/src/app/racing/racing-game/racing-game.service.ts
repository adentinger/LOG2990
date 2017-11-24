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
import { CarsService } from './cars.service';
import { GameInfo } from './game-info';
import { CarController } from './physic/ai/car-controller';
import { UserCarController } from './physic/ai/user-car-controller';
import { AiCarController } from './physic/ai/ai-car-controller';
import { CarsProgressionService } from './cars-progression.service';

const logger = Logger.getLogger();

export const GAME_START_EVENT = 'racing-start';

@Injectable()
export class RacingGameService {
    public readonly renderer: RacingRenderer;
    public readonly waitToLoad: Promise<void>;
    public readonly waitToFinalize: Observable<void>;
    private readonly finalizeSubject = new Subject<void>();
    private readonly info: GameInfo;

    private map: RenderableMap;

    private userInputs: UIInputs = null;

    constructor(private physicEngine: PhysicEngine,
        private mapService: MapService,
        private eventManager: EventManager,
        private soundService: SoundService,
        private carsService: CarsService,
        private carsProgressionService: CarsProgressionService) {
        this.info = new GameInfo(this.carsService, this.carsProgressionService);
        this.waitToLoad = Promise.all([
            this.carsService.waitToLoad,
            this.soundService.waitToLoad
        ]).then(() => { });
        this.waitToFinalize = this.finalizeSubject.asObservable();
        this.renderer = new RacingRenderer(eventManager, this.info);
        eventManager.registerClass(this);
    }

    public initialize(container: HTMLDivElement, hudCanvas: HTMLCanvasElement, userInputs: UIInputs): void {
        this.renderer.initialize(container, hudCanvas);
        this.soundService.initialize(this.renderer.getBothCameras()[0]);
        this.userInputs = userInputs;

        const userCar = this.carsService.getPlayerCar();
        this.renderer.setCamerasTarget(userCar);


        this.carsService.initialize(this.soundService, userInputs, this.map.mapLines);

        this.renderer.updateDayMode(RacingRenderer.DEFAULT_DAYMODE);

        // If the game is stopping before it was loaded, then don't start anything.
        Promise.race([
            this.waitToLoad,
            this.waitToFinalize.toPromise().then(() => { throw void (0); })
        ]).then(() => {
            this.physicEngine.start();
            this.renderer.startRendering();
            // this.soundService.setAbmiantSound(Sound.TETRIS);

            // this.carsService.startControllers();
            // this.waitToLoad.then(() => {
            //     this.soundService.playAmbiantSound(true);
            // });
            this.info.startTimer();
            this.soundService.setAbmiantSound(Sound.START_SOUND);
            this.waitToLoad.then(() => this.soundService.playAmbiantSound(false))
                .then(() => {
                    const event: EventManager.Event<void> = { name: GAME_START_EVENT, data: void 0 };
                    this.eventManager.fireEvent(event.name, event);
                    return this.soundService.setAbmiantSound(Sound.TETRIS);
                }).then(() => {
                    this.soundService.playAmbiantSound(true);
                    this.carsService.startControllers();
                });
        }, () => logger.warn('Initialization interrupted'));
    }

    public finalize() {
        this.finalizeSubject.next(); // Notify that the game (forcefully) Stops

        this.physicEngine.stop();
        this.renderer.stopRendering();

        this.carsService.finalize();
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
            this.carsService.removeFromMap(this.map);
            this.renderer.removeMap(this.map);
        }

        this.map = new RenderableMap(map, this.eventManager);
        this.physicEngine.initialize(this.map);
        this.renderer.addMap(this.map);

        this.carsService.addToMap(this.map);
        return this.map.waitToLoad.then(() => { });
    }

    public updateRendererSize(width: number, height: number) {
        this.renderer.updateSize(width, height);
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
            this.info.maxLap = +event.data.key;
        }
    }

}

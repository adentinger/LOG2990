import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { RacingGameService } from './racing-game.service';
import { MapService } from '../services/map.service';
import { UIInputs, KEYDOWN_EVENT } from './ui-input.service';
import { PhysicEngine } from './physic/engine';

import { EventManager } from '../../event-manager.service';
import { Class } from '../../../../../common/src/utils';

@Component({
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: [RacingGameService, PhysicEngine]
})
export class RacingGameComponent implements OnInit, OnDestroy {
    public static readonly HEADER_HEIGHT = 50;

    @ViewChild('racingGameCanvas')
    public racingGameCanvas: ElementRef;
    @ViewChild('userInputs')
    private uiInputs: UIInputs;

    private windowHalfX = window.innerWidth * 0.5;
    private windowHalfY = window.innerHeight * 0.5 - RacingGameComponent.HEADER_HEIGHT * 0.5;

    constructor(private racingGame: RacingGameService,
        private route: ActivatedRoute,
        private mapService: MapService,
        private eventManager: EventManager) {
        this.eventManager.registerClass(this);
    }

    public ngOnInit(): void {
        this.route.paramMap.switchMap((params: ParamMap) => [params.get('map-name')]).subscribe(mapName => {
            this.mapService.getByName(mapName)
                .then(map => {
                    this.racingGame.initialise(this.racingGameCanvas.nativeElement, map, this.uiInputs, this.eventManager);
                    this.onResize();
                });
        });
    }

    public ngOnDestroy() {
        this.racingGame.finalize();
    }

    @HostListener('window:resize', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private onResize() {
        const height = window.innerHeight - RacingGameComponent.HEADER_HEIGHT;
        const width = window.innerWidth;
        this.windowHalfX = width * 0.5;
        this.windowHalfY = height * 0.5;

        this.racingGame.resizeCanvas(width, height);
    }

    @EventManager.Listener(KEYDOWN_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onKeyDown() {
        if (this.uiInputs.isKeyPressed('c')) {
            this.racingGame.renderer.currentCamera = (1 - this.racingGame.renderer.currentCamera) as 0 | 1;
        }
        if (this.uiInputs.isKeyPressed('n')) {
            this.racingGame.changeDayMode();
        }
        if (this.uiInputs.isKeyPressed('v')) {
            this.racingGame.renderer.switchCamera1Position();
        }

        const isAllowedKeyCombination =
            this.uiInputs.areKeysPressed('control', 'shift', 'i') ||
            this.uiInputs.isKeyPressed('f5');

        if (!isAllowedKeyCombination) {
            return false; // Prevent Default behaviors
        }
    }

    @HostListener('window:contextmenu', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private preventEvent(event: Event) {
        return false; // Prevent Default behaviors
    }

}

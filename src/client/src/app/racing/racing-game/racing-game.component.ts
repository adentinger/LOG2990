import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { RacingGameService } from './racing-game.service';
import { MapService } from '../services/map.service';
import { UIInputs, KEYDOWN_EVENT } from './ui-input.service';
import { PhysicEngine } from './physic/engine';

import { Seconds } from '../types';
import { Vector3 } from 'three';
import { Point } from '../../../../../common/src/math/point';

import { SkyboxMode } from './skybox';
import { EventManager, EventListener } from '../../event-manager.service';

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
                    this.racingGame.initialise(this.racingGameCanvas.nativeElement, map, this.uiInputs);
                    this.racingGame.resizeCanvas(this.windowHalfX * 2, this.windowHalfY * 2);
                });
        });
        this.checkPointerLock();
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

    private checkPointerLock() {
        if (document.pointerLockElement !== this.racingGameCanvas.nativeElement) {
            (<HTMLCanvasElement>this.racingGameCanvas.nativeElement).requestPointerLock();
        }
    }


    @HostListener('mousemove', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private onMouseMove(e: MouseEvent) {
        if (document.pointerLockElement === this.racingGameCanvas.nativeElement) {
            if (this.racingGame.renderer && this.racingGame.renderer.CAMERA1) {
                const rotation = new Point(
                    e.movementX / this.windowHalfX,
                    e.movementY / this.windowHalfY
                );
                this.racingGame.cameraRotation = rotation;
            }
        }
    }

    @HostListener('click', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private onClick(e: MouseEvent) {
        this.checkPointerLock();
    }

    @EventListener(KEYDOWN_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onKeyDown() {
        if (this.uiInputs.isKeyPressed('c')) {
            this.racingGame.renderer.currentCamera = (1 - this.racingGame.renderer.currentCamera) as 0 | 1;
        }
        if (this.uiInputs.isKeyPressed('n')) {
            const SKYBOX = this.racingGame.renderer.SKYBOX;
            switch (SKYBOX.mode) {
                case SkyboxMode.DAY: SKYBOX.mode = SkyboxMode.NIGHT; break;
                case SkyboxMode.NIGHT: SKYBOX.mode = SkyboxMode.DAY; break;
                default: break;
            }
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

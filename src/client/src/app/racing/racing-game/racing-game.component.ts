import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { RacingGameService } from './racing-game.service';
import { Point } from '../../../../../common/src/math/point';
import { SkyboxMode } from './skybox';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RenderableMap } from './racing-game-map/renderable-map';
import { MapService } from '../services/map.service';
import { Vector3 } from 'three';
import { PhysicEngine } from './physic/engine';
import { Seconds } from '../types';

const LEFT_MOUSE_BUTTON = 0;

@Component({
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: [RacingGameService, PhysicEngine]
})
export class RacingGameComponent implements OnInit, OnDestroy {
    public static readonly HEADER_HEIGHT = 50;
    private static readonly KEY_TIMER_FREQUENCY = 60;

    @ViewChild('racingGameCanvas')
    public racingGameCanvas: ElementRef;

    private windowHalfX = window.innerWidth * 0.5;
    private windowHalfY = window.innerHeight * 0.5 - RacingGameComponent.HEADER_HEIGHT * 0.5;

    private pressedKeys: Set<string> = new Set();
    private keyTimer: any = null;

    constructor(private racingGame: RacingGameService, private route: ActivatedRoute, private mapService: MapService) { }

    public ngOnInit(): void {
        this.route.paramMap.switchMap((params: ParamMap) => [params.get('map-name')]).subscribe(mapName => {
            this.mapService.getByName(mapName)
                .then(map => {
                    this.racingGame.initialise(this.racingGameCanvas.nativeElement, map);
                    this.racingGame.resizeCanvas(this.windowHalfX * 2, this.windowHalfY * 2);
                    this.startKeyTimer();
                });
        });
        this.checkPointerLock();
    }

    public ngOnDestroy() {
        this.stopKeyTimer();
    }

    private startKeyTimer() {
        let now = Date.now(), last = now; // ms
        this.keyTimer = setInterval(() => {
            now = Date.now();
            const deltaTimeMS = now - last;
            this.updateCameraVelocity(deltaTimeMS / 1000);
            last = now;
        }, 1000 / RacingGameComponent.KEY_TIMER_FREQUENCY);
    }

    private stopKeyTimer() {
        clearInterval(this.keyTimer);
        this.keyTimer = null;
    }

    @HostListener('window:resize', ['$event'])
    private onResize() {
        const height = (window).innerHeight - RacingGameComponent.HEADER_HEIGHT;
        const width = (window).innerWidth;
        this.windowHalfX = width * 0.5;
        this.windowHalfY = height * 0.5;

        this.racingGame.resizeCanvas(width, height);
    }

    private checkPointerLock() {
        if (document.pointerLockElement !== this.racingGameCanvas.nativeElement) {
            (<HTMLCanvasElement>this.racingGameCanvas.nativeElement).requestPointerLock();
        }
    }

    private updateCameraVelocity(deltaTime: Seconds) {
        const ACCELERATION = 7; // m/s^2
        const DESIRED_SPEED = 5.0;
        if (this.racingGame.CAMERA1) {
            const rotation = this.racingGame.CAMERA1.rotation;
            const direction = new Vector3();
            if (this.pressedKeys.has('w')) {
                direction.add(new Vector3(0, 0, -1));
            }
            if (this.pressedKeys.has('s')) {
                direction.add(new Vector3(0, 0, 1));
            }
            if (this.pressedKeys.has('d')) {
                direction.add(new Vector3(1, 0, 0));
            }
            if (this.pressedKeys.has('a')) {
                direction.add(new Vector3(-1, 0, 0));
            }

            const accelerationDirection = (direction).applyEuler(rotation).setY(0).normalize();
            const acceleration = accelerationDirection.multiplyScalar(ACCELERATION)
                .multiplyScalar(DESIRED_SPEED - this.racingGame.cameraVelocity.length());
            this.racingGame.cameraVelocity = this.racingGame.cameraVelocity
                .addScaledVector(acceleration, deltaTime);
        }
    }

    @HostListener('mousemove', ['$event'])
    public onMouseMove(e: MouseEvent) {
        if (this.racingGame.renderer && this.racingGame.CAMERA1) {
            const ROTATION = new Point(
                e.movementX / this.windowHalfX,
                e.movementY / this.windowHalfY
            );
            if (document.pointerLockElement === this.racingGameCanvas.nativeElement) {
                this.racingGame.cameraRotation = ROTATION;
            }
        }
    }

    @HostListener('click', ['$event'])
    public onFocus(e: MouseEvent) {
        this.checkPointerLock();
    }

    @HostListener('window:keydown', ['$event'])
    private onKeyDown(event: KeyboardEvent) {
        this.pressedKeys.add(event.key.toLowerCase());

        if (this.pressedKeys.has('c')) {
            this.racingGame.currentCamera = (1 - this.racingGame.currentCamera) as 0 | 1;
        }
        if (this.pressedKeys.has('n')) {
            const SKYBOX = this.racingGame.renderer.SKYBOX;
            switch (SKYBOX.mode) {
                case SkyboxMode.DAY: SKYBOX.mode = SkyboxMode.NIGHT; break;
                case SkyboxMode.NIGHT: SKYBOX.mode = SkyboxMode.DAY; break;
                default: break;
            }
        }

        if (!event.ctrlKey || event.key !== 'I') { // Allows for Ctrl+Shift+I
            return false; // Prevent Default behaviors
        }
    }

    @HostListener('window:keyup', ['$event'])
    private onKeyUp(event: KeyboardEvent) {
        this.pressedKeys.delete(event.key.toLowerCase());
    }

    @HostListener('window:contextmenu', ['$event'])
    private preventEvent(event: Event) {
        event.preventDefault();
    }

}

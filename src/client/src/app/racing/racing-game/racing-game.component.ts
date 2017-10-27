import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { RacingGameService } from './racing-game.service';
import { Point } from '../../../../../common/src/math/point';
import { SkyboxMode } from './skybox';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MapService } from '../services/map.service';
import { Vector3 } from 'three';
import { PhysicEngine } from './physic/engine';
import { Seconds } from '../types';

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
        this.racingGame.finalize();
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
    // tslint:disable-next-line:no-unused-variable
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
        if (this.racingGame.renderer.CAMERA1) {
            const rotation = this.racingGame.renderer.CAMERA1.rotation;
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
    // tslint:disable-next-line:no-unused-variable
    private onMouseMove(e: MouseEvent) {
        if (this.racingGame.renderer && this.racingGame.renderer.CAMERA1) {
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
    // tslint:disable-next-line:no-unused-variable
    private onClick(e: MouseEvent) {
        this.checkPointerLock();
    }

    @HostListener('window:keydown', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private onKeyDown(event: KeyboardEvent) {
        this.pressedKeys.add(event.key.toLowerCase());

        if (this.pressedKeys.has('c')) {
            this.racingGame.renderer.currentCamera = (1 - this.racingGame.renderer.currentCamera) as 0 | 1;
        }
        if (this.pressedKeys.has('n')) {
            const SKYBOX = this.racingGame.renderer.SKYBOX;
            switch (SKYBOX.mode) {
                case SkyboxMode.DAY: SKYBOX.mode = SkyboxMode.NIGHT; break;
                case SkyboxMode.NIGHT: SKYBOX.mode = SkyboxMode.DAY; break;
                default: break;
            }
        }

        if (!(this.pressedKeys.has('i') && this.pressedKeys.has('control') && this.pressedKeys.has('shift')) &&
            !(this.pressedKeys.has('f5'))) { // Allows for Ctrl+Shift+I and F5
            return false; // Prevent Default behaviors
        }
    }

    @HostListener('window:keyup', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private onKeyUp(event: KeyboardEvent) {
        this.pressedKeys.delete(event.key.toLowerCase());
    }

    @HostListener('window:contextmenu', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private preventEvent(event: Event) {
        event.preventDefault();
    }

}

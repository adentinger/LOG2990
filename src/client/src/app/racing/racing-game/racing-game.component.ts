import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { RacingGameService } from './racing-game.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MapService } from '../services/map.service';
import { Vector3, Euler } from 'three';
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
    private static readonly CAR_TIMER_FREQUENCY = 60;

    @ViewChild('racingGameCanvas')
    public racingGameCanvas: ElementRef;

    private windowHalfX = window.innerWidth * 0.5;
    private windowHalfY = window.innerHeight * 0.5 - RacingGameComponent.HEADER_HEIGHT * 0.5;

    private pressedKeys: Set<string> = new Set();
    private carTimer: any = null;

    constructor(private racingGame: RacingGameService, private route: ActivatedRoute, private mapService: MapService) { }

    public ngOnInit(): void {
        this.route.paramMap.switchMap((params: ParamMap) => [params.get('map-name')]).subscribe(mapName => {
            this.mapService.getByName(mapName)
                .then(map => {
                    this.racingGame.initialise(this.racingGameCanvas.nativeElement, map);
                    this.racingGame.resizeCanvas(this.windowHalfX * 2, this.windowHalfY * 2);
                    this.startCarTimer();
                });
        });
    }

    public ngOnDestroy() {
        this.stopCarTimer();
        this.racingGame.finalize();
    }

    private startCarTimer() {
        let now = Date.now(), last = now;
        this.carTimer = setInterval(() => {
            now = Date.now();
            const deltaTimeMS = now - last;
            this.updateCarPosition(deltaTimeMS / 1000);
            last = now;
        }, 1000 / RacingGameComponent.CAR_TIMER_FREQUENCY);
    }

    private stopCarTimer() {
        clearInterval(this.carTimer);
        this.carTimer = null;
    }

    private updateCarPosition(deltaTime: Seconds) {
        const SPEED = 5; // m/s
        const ANGULAR_SPEED = Math.PI; // rad/s
        const position = this.racingGame.renderer.CAR.position;
        const rotation = this.racingGame.renderer.CAR.rotation;
        if (this.pressedKeys.has('w')) {
            position.add((new Vector3(0, 0, -1)).applyEuler(rotation).setY(0).normalize().multiplyScalar(SPEED * deltaTime));
        }
        if (this.pressedKeys.has('s')) {
            position.add((new Vector3(0, 0, -1)).applyEuler(rotation).setY(0).normalize().multiplyScalar(-SPEED * deltaTime));
        }
        if (this.pressedKeys.has('d')) {
            rotation.y -= ANGULAR_SPEED * deltaTime;
        }
        if (this.pressedKeys.has('a')) {
            rotation.y += ANGULAR_SPEED * deltaTime;
        }
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

    @HostListener('window:keydown', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private onKeyDown(event: KeyboardEvent) {
        this.pressedKeys.add(event.key.toLowerCase());

        if (this.pressedKeys.has('c')) {
            this.racingGame.renderer.currentCamera = (1 - this.racingGame.renderer.currentCamera) as 0 | 1;
        }
        if (this.pressedKeys.has('n')) {
            this.racingGame.changeDayMode();
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

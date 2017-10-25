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

const LEFT_MOUSE_BUTTON = 0;

@Component({
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: [RacingGameService, PhysicEngine]
})
export class RacingGameComponent implements OnInit, OnDestroy {
    private static readonly HEADER_HEIGHT = 50;

    @ViewChild('racingGameCanvas')
    public racingGameCanvas: ElementRef;

    private windowHalfX = window.innerWidth * 0.5;
    private windowHalfY = window.innerHeight * 0.5;

    private pressedKeys: Set<string> = new Set();
    private keyTimer: any = null;

    constructor(private racingGame: RacingGameService, private route: ActivatedRoute, private mapService: MapService) { }

    public ngOnInit(): void {
        this.route.paramMap.switchMap((params: ParamMap) => [params.get('map-name')]).subscribe(mapName => {
            this.mapService.getByName(mapName)
                .then(map => {
                    this.racingGame.initialise(this.racingGameCanvas.nativeElement, map);
                    this.resizeCanvas();
                    this.keyTimer = setInterval(this.updateCameraVelocity.bind(this), 1000 / 60);
                });
        });
        this.checkPointerLock();
    }

    public ngOnDestroy() {
        clearInterval(this.keyTimer);
        this.keyTimer = null;
    }

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.resizeCanvas();
    }

    private resizeCanvas() {
        const height = (window).innerHeight - RacingGameComponent.HEADER_HEIGHT;
        const width = (window).innerWidth;
        const CAMERA = this.racingGame.renderer.CAMERA1;

        this.windowHalfX = width * 0.5;
        this.windowHalfY = height * 0.5;
        this.racingGame.renderer.RENDERER.setSize(width, height);
        this.racingGame.renderer.CAMERA1.aspect = width / height;
        this.racingGame.renderer.CAMERA1.updateProjectionMatrix();
    }

    private checkPointerLock() {
        if (document.pointerLockElement !== this.racingGameCanvas.nativeElement) {
            (<HTMLCanvasElement>this.racingGameCanvas.nativeElement).requestPointerLock();
        }
    }

    private updateCameraVelocity() {
        if (this.racingGame.renderer.CAMERA1) {
            const CAMERA = this.racingGame.renderer.CAMERA1;
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
            CAMERA.velocity = (direction).applyEuler(rotation).setY(0).normalize().multiplyScalar(5);
        }
    }

    @HostListener('mousemove', ['$event'])
    public onMouseMove(e: MouseEvent) {
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
    public onClick(e: MouseEvent) {
        if (e.button === LEFT_MOUSE_BUTTON) {
            const SKYBOX = this.racingGame.renderer.SKYBOX;
            switch (SKYBOX.mode) {
                case SkyboxMode.DAY: SKYBOX.mode = SkyboxMode.NIGHT; break;
                case SkyboxMode.NIGHT: SKYBOX.mode = SkyboxMode.DAY; break;
                default: break;
            }
        }
        this.checkPointerLock();
    }

    @HostListener('window:keydown', ['$event'])
    private onKeyDown(event: KeyboardEvent) {
        if (!event.ctrlKey || event.key !== 'I') { // Allows for Ctrl+Shift+I
            event.preventDefault();
        }

        this.pressedKeys.add(event.key.toLowerCase());
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

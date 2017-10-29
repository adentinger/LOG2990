import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Vector3 } from 'three';
import 'rxjs/add/operator/toPromise';

import { RacingGameService } from './racing-game.service';
import { Point } from '../../../../../common/src/math/point';
import { RenderableMap } from './racing-game-map/renderable-map';
import { MapService } from '../services/map.service';
import { DayModeManager, DayMode } from './day-mode/day-mode-manager';

const LEFT_MOUSE_BUTTON = 0;

@Component({
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: [RacingGameService]
})
export class RacingGameComponent implements OnInit {
    private static readonly HEADER_HEIGHT = 50;

    @ViewChild('racingGame')
    public racingGame: ElementRef;

    @ViewChild('racingGameCanvas')
    public racingGameCanvas: ElementRef;

    private windowHalfX = window.innerWidth * 0.5;
    private windowHalfY = window.innerHeight * 0.5;

    private map: RenderableMap;
    private dayModeManager: DayModeManager = new DayModeManager();

    constructor(private racingGameRenderer: RacingGameService, private route: ActivatedRoute, private mapService: MapService) { }

    public ngOnInit(): void {
        this.racingGameRenderer.initialise(this.racingGameCanvas.nativeElement);
        this.route.paramMap.switchMap((params: ParamMap) => [params.get('map-name')]).subscribe(mapName => {
            this.mapService.getByName(mapName)
            .then(map => this.map = new RenderableMap(map));
        });
        this.resizeCanvas();
        (<HTMLCanvasElement>this.racingGameCanvas.nativeElement).requestPointerLock();
    }

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.resizeCanvas();
    }

    private resizeCanvas() {
        const height = (window).innerHeight - RacingGameComponent.HEADER_HEIGHT;
        const width = (window).innerWidth;
        const CAMERA = this.racingGameRenderer.racingGameRendering.CAMERA;

        this.windowHalfX = width * 0.5;
        this.windowHalfY = height * 0.5;
        this.racingGameRenderer.racingGameRendering.RENDERER.setSize(width, height);
        this.racingGameRenderer.racingGameRendering.CAMERA.aspect = width / height;
        this.racingGameRenderer.racingGameRendering.CAMERA.updateProjectionMatrix();
    }

    @HostListener('mousemove', ['$event'])
    public onMouseMove(e: MouseEvent) {
        const MOUSE_POSITION = new Point(
            (e.clientX - this.windowHalfX) / (this.windowHalfX),
            (e.clientY - RacingGameComponent.HEADER_HEIGHT - this.windowHalfY) / (this.windowHalfY)
        );
        this.racingGameRenderer.cursorPosition = MOUSE_POSITION;
    }

    @HostListener('window:keydown', ['$event'])
    private onKeyUp(event: KeyboardEvent) {
        if (!event.ctrlKey || event.key !== 'I') { // Allows for Ctrl+Shift+I
            event.preventDefault();
        }

        const position = this.racingGameRenderer.racingGameRendering.CAMERA.position;
        const rotation = this.racingGameRenderer.racingGameRendering.CAMERA.rotation;
        if (event.key.toLowerCase() === 'w') {
            position.add((new Vector3(0, 0, -1)).applyEuler(rotation).setY(0).normalize().multiplyScalar(0.1));
        }
        if (event.key.toLowerCase() === 's') {
            position.add((new Vector3(0, 0, -1)).applyEuler(rotation).setY(0).normalize().multiplyScalar(-0.1));
        }
        if (event.key.toLowerCase() === 'd') {
            position.add((new Vector3(1, 0, 0)).applyEuler(rotation).setY(0).normalize().multiplyScalar(0.1));
        }
        if (event.key.toLowerCase() === 'a') {
            position.add((new Vector3(1, 0, 0)).applyEuler(rotation).setY(0).normalize().multiplyScalar(-0.1));
        }
        if (event.key.toLowerCase() === 'n') {
            let newDayMode: DayMode;
            switch (this.dayModeManager.mode) {
                case DayMode.DAY: newDayMode = DayMode.NIGHT; break;
                case DayMode.NIGHT: newDayMode = DayMode.DAY; break;
                default: break;
            }
            this.dayModeManager.mode = newDayMode;
            this.dayModeManager.updateScene(this.racingGameRenderer.racingGameRendering.SCENE);
        }
    }

    @HostListener('window:contextmenu', ['$event'])
    private preventEvent(event: Event) {
        event.preventDefault();
    }

}

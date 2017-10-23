import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { RacingGameService } from './racing-game.service';
import { Point } from '../../../../../common/src/math/point';
import { SkyboxMode } from './skybox';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RenderableMap } from './racing-game-map/renderable-map';
import { MapService } from '../services/map.service';
import 'rxjs/add/operator/toPromise';

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

    constructor(private racingGameRenderer: RacingGameService, private route: ActivatedRoute, private mapService: MapService) { }

    public ngOnInit(): void {
        this.racingGameRenderer.initialise(this.racingGameCanvas.nativeElement);
        this.route.paramMap.switchMap((params: ParamMap) => params.get('map-name')).toPromise()
        .then(map => this.mapService.getByName(map))
        .then(map => this.map = new RenderableMap(map));
        this.resize();
    }

    public onResize() {
        this.resize();
    }

    private resize() {
        const height = (window).innerHeight - RacingGameComponent.HEADER_HEIGHT;
        const width = (window).innerWidth;
        const CAMERA = this.racingGameRenderer.racingGameRendering.CAMERA;

        this.windowHalfX = width * 0.5;
        this.windowHalfY = height * 0.5;
        this.racingGameRenderer.racingGameRendering.RENDERER.setSize(width, height);
        this.racingGameRenderer.racingGameRendering.CAMERA.aspect = width / height;
        this.racingGameRenderer.racingGameRendering.CAMERA.updateProjectionMatrix();
    }

    public onMouseMove(e: MouseEvent) {
        const MOUSE_POSITION = new Point(
            (e.clientX - this.windowHalfX) / (this.windowHalfX),
            (e.clientY - this.windowHalfY) / (this.windowHalfY)
        );
        this.racingGameRenderer.cursorPosition = MOUSE_POSITION;
    }

    public onClick(e: MouseEvent) {
        if (e.button === LEFT_MOUSE_BUTTON) {
            const SKYBOX = this.racingGameRenderer.racingGameRendering.SKYBOX;
            switch (SKYBOX.mode) {
                case SkyboxMode.DAY: SKYBOX.mode = SkyboxMode.NIGHT; break;
                case SkyboxMode.NIGHT: SKYBOX.mode = SkyboxMode.DAY; break;
                default: break;
            }
        }
    }

}

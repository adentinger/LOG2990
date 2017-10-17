import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RacingGameService } from './racing-game.service';
import { Point } from '../../common/math/point';

@Component({
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: [RacingGameService]
})
export class RacingGameComponent implements OnInit {

    @ViewChild('racingGame')
    public racingGame: ElementRef;

    @ViewChild('racingGameCanvas')
    public racingGameCanvas: ElementRef;

    private windowHalfX = window.innerWidth * 0.5;
    private windowHalfY = window.innerHeight * 0.5;

    constructor(private racingGameRenderer: RacingGameService) { }

    public ngOnInit(): void {
        this.racingGameRenderer.initialise(this.racingGameCanvas);
    }

    public onResize() {
        const height = (window).innerHeight;
        const width = (window).innerWidth;
        console.log('height', height, 'width', width);

        this.windowHalfX = width * 0.5;
        this.windowHalfY = height * 0.5;
        this.racingGameRenderer.racingGameRendering.CAMERA.aspect = width / height;
        this.racingGameRenderer.racingGameRendering.CAMERA.updateProjectionMatrix();
    }

    public onMouseMove(e) {
        const MOUSE_POSITION = new Point(
            (e.clientX - this.windowHalfX) / (this.windowHalfX),
            (e.clientY - this.windowHalfY) / (this.windowHalfY)
        );
        this.racingGameRenderer.cursorPosition = MOUSE_POSITION;
    }

}

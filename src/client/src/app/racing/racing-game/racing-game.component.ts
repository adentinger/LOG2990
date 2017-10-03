import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { RacingGameService } from './racing-game.service';

@Component({
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: [RacingGameService]
})
export class RacingGameComponent implements OnInit {

    @ViewChild('racingGame')
    public racingGame: ElementRef;

    private mouseX = 0;
    private mouseY = 0;
    private windowHalfX = window.innerWidth * 0.5;
    private windowHalfY = window.innerHeight * 0.5;

    constructor(private racingGameRenderer: RacingGameService) { }

    public ngOnInit(): void {
        this.addRenderer();
        this.racingGameRenderer.initialise();
    }

    private addRenderer(): void {
        this.racingGame.nativeElement.appendChild(this.racingGameRenderer.racingGameRendering.RENDERER.domElement);
    }
/*
    public onMouseMove(e) {
        this.mouseX = (e.clientX - this.windowHalfX) * 10;
        this.mouseY = (e.clientY - this.windowHalfY) * 10;
    }

    public mapRenderer() {
        requestAnimationFrame(this.racingGameRenderer.renderGame);
        this.racingGameRenderer.racingGameRendering.CAMERA.position.x += (this.mouseX -
            this.racingGameRenderer.racingGameRendering.CAMERA.position.x)
            * .02;
        this.racingGameRenderer.racingGameRendering.CAMERA.position.y += (-this.mouseY -
            this.racingGameRenderer.racingGameRendering.CAMERA.position.y)
            * .02;
        this.racingGameRenderer.racingGameRendering.CAMERA.lookAt(this.racingGameRenderer.racingGameRendering.SCENE.position);
        this.racingGameRenderer.updateRenderer();
    }
*/
}

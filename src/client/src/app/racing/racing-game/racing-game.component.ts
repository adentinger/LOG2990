import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { RacingGameService } from './racing-game.service';
import { UIInputs, KEYDOWN_EVENT } from '../services/ui-input.service';
import { PhysicEngine } from './physic/engine';

import { EventManager } from '../../event-manager.service';

@Component({
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css']
})
export class RacingGameComponent implements OnInit, OnDestroy {
    public static readonly HEADER_HEIGHT = 50;
    public static readonly MAP_NAME_URL_PARAMETER = 'map-name';

    @ViewChild('gameContainer')
    public racingGameContainer: ElementRef;
    @ViewChild('userInputs')
    private uiInputs: UIInputs;

    constructor(private racingGame: RacingGameService,
        private route: ActivatedRoute,
        private eventManager: EventManager) {
        this.eventManager.registerClass(this);
    }

    public ngOnInit(): void {
        this.route.paramMap.switchMap((params: ParamMap) => [params.get(RacingGameComponent.MAP_NAME_URL_PARAMETER)]).subscribe(mapName => {
            this.racingGame.loadMap(mapName).then(() => {
                this.racingGame.initialise(this.racingGameContainer.nativeElement, this.uiInputs);
                this.updateRendererSize();
            });
        });
    }

    public ngOnDestroy() {
        this.racingGame.finalize();
    }

    @HostListener('window:resize', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private updateRendererSize() {
        const height = window.innerHeight - RacingGameComponent.HEADER_HEIGHT;
        const width = window.innerWidth;

        this.racingGame.updateRendererSize(width, height);
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

        const areAllowedKeyCombinationsPressed =
            this.uiInputs.areKeysPressed('control', 'shift', 'i') ||
            this.uiInputs.isKeyPressed('f5');

        if (!areAllowedKeyCombinationsPressed) {
            return false; // Prevent Default behaviors
        }
    }

    @HostListener('window:contextmenu', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private preventEvent(event: Event) {
        return false; // Prevent Default behaviors
    }

}

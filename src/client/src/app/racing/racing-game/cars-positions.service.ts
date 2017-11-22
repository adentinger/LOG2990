import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Car } from './models/car/car';
import { RacingGameService } from './racing-game.service';
import { Point } from '../../../../../common/src/math/point';
import { Line } from '../../../../../common/src/math/line';
import { GameInfo } from './game-info';

@Injectable()
export class CarsPositionsService {
    private gameInfo: GameInfo;

    public initialize(gameInfo: GameInfo) {
        this.gameInfo = gameInfo;
        // setInterval(() => console.log(this.playerCoordinates), 3000);
    }

    public get playerCoordinates(): THREE.Vector {
        return this.gameInfo.controlledCar.position;
    }

    public getPlayerProgressionInPercent(): number {
        return 0;
    }

    private getMapLength(): number {
        return 0; // MOCK
    }
}

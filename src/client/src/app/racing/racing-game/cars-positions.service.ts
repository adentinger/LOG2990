import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { GameInfo } from './game-info';

@Injectable()
export class CarsPositionsService {
    private gameInfo: GameInfo;

    public initialize(gameInfo: GameInfo) {
        this.gameInfo = gameInfo;
        setInterval(() => console.log(this.playerCoordinates), 3000);
    }

    public get playerCoordinates(): THREE.Vector {
        return this.gameInfo.controlledCar.position;
    }
}

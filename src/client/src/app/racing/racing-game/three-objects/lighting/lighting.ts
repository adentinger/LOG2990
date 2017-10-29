import * as THREE from 'three';

import { DayModeNotifiable } from '../../day-mode/day-mode-notifiable';
import { DayMode } from '../../day-mode/day-mode';

/**
 * Class which manages the scene's lighting.
 * The scene's lighting is a three-point lighting:
 * https://en.wikipedia.org/wiki/Three-point_lighting
 */
export class Lighting extends THREE.Object3D implements DayModeNotifiable {

    private readonly KEY_LIGHT: THREE.DirectionalLight;
    private readonly FILL_LIGHT: THREE.DirectionalLight;
    private readonly BACK_LIGHT: THREE.DirectionalLight;

    constructor() {
        super();
        this.KEY_LIGHT  = new THREE.DirectionalLight(0x000000, 0);
        this.FILL_LIGHT = new THREE.DirectionalLight(0x000000, 0);
        this.BACK_LIGHT = new THREE.DirectionalLight(0x000000, 0);
        this.add(this.KEY_LIGHT, this.FILL_LIGHT, this.BACK_LIGHT);
    }

    public dayModeChanged(newMode: DayMode): void {

    }

}

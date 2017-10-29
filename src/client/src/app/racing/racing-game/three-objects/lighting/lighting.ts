import * as THREE from 'three';

import { DayModeNotifiable } from '../../day-mode/day-mode-notifiable';
import { DayMode } from '../../day-mode/day-mode';

/**
 * Class which manages the scene's lighting.
 * The scene's lighting is a three-point lighting:
 * https://en.wikipedia.org/wiki/Three-point_lighting
 */
export class Lighting extends THREE.Object3D implements DayModeNotifiable {

    public dayModeChanged(newMode: DayMode): void {

    }

}

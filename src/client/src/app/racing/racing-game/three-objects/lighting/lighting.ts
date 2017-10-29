import * as THREE from 'three';

import { DayModeNotifiable } from '../../day-mode/day-mode-notifiable';
import { DayMode } from '../../day-mode/day-mode';

export class Lighting extends THREE.Object3D implements DayModeNotifiable {

    public dayModeChanged(newMode: DayMode): void {

    }

}

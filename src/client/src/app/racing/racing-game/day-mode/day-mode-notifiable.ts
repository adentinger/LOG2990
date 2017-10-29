import { DayMode } from './day-mode-manager';

export interface DayModeNotifiable extends THREE.Object3D {

    dayModeChanged(newMode: DayMode): void;

}

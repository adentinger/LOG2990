import { DayMode } from './day-mode-manager';

export interface DayModeNotifiable extends THREE.Object3D {

    dayModeChanged(newMode: DayMode): void;

}

export function isDayModeNotifiable(obj: any): obj is DayModeNotifiable {
    return false;
}

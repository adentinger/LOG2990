import { DayMode } from './day-mode-manager';
import { hasFunctions } from '../../../../../../common/src/utils';

export interface DayModeNotifiable extends THREE.Object3D {

    dayModeChanged(newMode: DayMode): void;

}

const FUNCTIONS_TO_CHECK = [
    { name: 'dayModeChanged', parameterCount: 1}
];
export function isDayModeNotifiable(obj: any): obj is DayModeNotifiable {
    return hasFunctions(obj, FUNCTIONS_TO_CHECK);
}

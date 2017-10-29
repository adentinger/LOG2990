import { DayMode } from './day-mode-manager';

export interface DayModeNotifiable extends THREE.Object3D {

    dayModeChanged(newMode: DayMode): void;

}

export function isDayModeNotifiable(obj: any): obj is DayModeNotifiable {
    const FUNCTIONS_TO_CHECK = [
        { name: 'dayModeChanged', numParams: 1}
    ];
    let isDayModeNotifiable = (obj != null);
    for (let i = 0; i < FUNCTIONS_TO_CHECK.length && isDayModeNotifiable; ++i) {
        const FUNCTION_TO_CHECK = FUNCTIONS_TO_CHECK[i];
        isDayModeNotifiable =
            FUNCTION_TO_CHECK.name in obj &&
            obj[FUNCTION_TO_CHECK.name].length === FUNCTION_TO_CHECK.numParams;
    }
    return isDayModeNotifiable;
}

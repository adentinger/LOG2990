import { hasFunctions, FunctionDescriptor } from '../../../../../common/src/utils';

export enum DayMode {
    DAY,
    NIGHT
}

export interface DayModeChangeNotifiable {
    onDayModeChange(mode: DayMode): void;
}

const FUNCTIONS: FunctionDescriptor[] = [{name: 'onDayModeChange', parameterCount: 1}];
export function isDayModeChangeNotifiable(object: any): object is DayModeChangeNotifiable {
    return object != null && hasFunctions(object, FUNCTIONS);
}

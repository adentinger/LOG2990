export enum DayMode {
    DAY,
    NIGHT
}

export interface DayModeChangeNotifiable {
    changeModeTo(mode: DayMode): void;
}

export function isDayModeChangeNotifiable(object: any): object is DayModeChangeNotifiable {
    return object != null && 'changeModeTo' in object && typeof object['changeModeTo'] === 'function' &&
        object['changeModeTo'].length >= 1;
}

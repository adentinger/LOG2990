import { CarHeadlightDayModeOptions } from '../three-objects/car/car-headlight';

/**
 * Class whose values (DAY and NIGHT) contain the data required to go to
 * the new day mode.
 *
 * Implementation of the State pattern.
 */
export abstract class DayMode {

    public static readonly DAY: DayModeDay;
    public static readonly NIGHT: DayModeNight;

    public abstract get CAR_HEADLIGHT_OPTIONS(): CarHeadlightDayModeOptions;
    public abstract nextMode(): DayMode;

    protected constructor() {}

}


class DayModeDay extends DayMode {

    constructor() {
        super();
    }

    public get CAR_HEADLIGHT_OPTIONS(): CarHeadlightDayModeOptions {
        return {intensity: 0};
    }

    public nextMode(): DayMode {
        return DayMode.NIGHT;
    }

}


// tslint:disable-next-line:max-classes-per-file
class DayModeNight extends DayMode {

    constructor() {
        super();
    }

    public get CAR_HEADLIGHT_OPTIONS(): CarHeadlightDayModeOptions {
        return {intensity: 1};
    }

    public nextMode(): DayMode {
        return DayMode.DAY;
    }

}


// Assign modes

(DayMode.DAY as any) = new DayModeDay();
(DayMode.NIGHT as any) = new DayModeNight();

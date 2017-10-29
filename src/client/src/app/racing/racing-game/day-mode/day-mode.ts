import { CarHeadlightDayModeOptions } from '../three-objects/car/car-headlight';

/**
 * Subclasses contain data about going to their mode.
 * Implementation of the State pattern.
 */
export abstract class DayMode {

    public abstract get carHeadlightOptions(): CarHeadlightDayModeOptions;

    public abstract nextMode(): DayMode;

}

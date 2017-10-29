import { DayMode } from './day-mode';
import { CarHeadlightDayModeOptions } from '../three-objects/car/car-headlight';

/**
 * Contains the scene's for going to day mode.
 */
export class DayModeDay extends DayMode {

    public get carHeadlightOptions(): CarHeadlightDayModeOptions {
        return {intensity: 0};
    }

}

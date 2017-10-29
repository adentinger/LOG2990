import { DayMode } from './day-mode';
import { CarHeadlightDayModeOptions } from '../three-objects/car/car-headlight';

/**
 * Contains the scene's for going to night mode.
 */
export class DayModeNight extends DayMode {

    public get carHeadlightOptions(): CarHeadlightDayModeOptions {
        return {intensity: 1};
    }

}

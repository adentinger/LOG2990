import { DayMode } from './day-mode';
import { CarHeadlightDayModeOptions } from '../three-objects/car/car-headlight';
import { DayModeDay } from './day-mode-day';

/**
 * Contains the scene's for going to night mode.
 */
export class DayModeNight extends DayMode {

    public get carHeadlightOptions(): CarHeadlightDayModeOptions {
        return {intensity: 1};
    }

    public nextMode(): DayMode {
        return new DayModeDay();
    }

}

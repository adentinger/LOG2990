import { DayMode } from './day-mode';
import { CarHeadlightDayModeOptions } from '../three-objects/car/car-headlight';
import { DayModeNight } from './day-mode-night';

/**
 * Contains the scene's for going to day mode.
 */
export class DayModeDay extends DayMode {

    public get carHeadlightOptions(): CarHeadlightDayModeOptions {
        return {intensity: 0};
    }

    public nextMode(): DayMode {
        return new DayModeNight();
    }

}

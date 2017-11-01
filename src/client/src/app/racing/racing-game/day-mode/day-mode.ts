import * as THREE from 'three';

import { CarHeadlightDayModeOptions } from '../three-objects/car/car-headlight';
import { LightingOptions } from '../three-objects/lighting/lighting';

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
    public abstract get LIGHTING_OPTIONS(): LightingOptions;
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

    public get LIGHTING_OPTIONS(): LightingOptions {
        const COLOR = 0xfff6a3;
        return {
            keyLight: {
                color: COLOR,
                intensity: 1,
                rotation: new THREE.Euler(0.478, 1.837, 0, 'YXZ')
            },
            fillLight: {
                color: COLOR,
                intensity: 0.5,
                rotation: new THREE.Euler(Math.PI / 10, 0, 0, 'YXZ')
            },
            backlight: {
                color: COLOR,
                intensity: 0.4,
                rotation: new THREE.Euler(Math.PI / 8, -3 * Math.PI / 4, 0, 'YXZ')
            }
        };
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

    public get LIGHTING_OPTIONS(): LightingOptions {
        const COLOR = 0xe8e7e3;
        return {
            keyLight: {
                color: COLOR,
                intensity: 0.33,
                rotation: new THREE.Euler(0.374, 2.760, 0, 'YXZ')
            },
            fillLight: {
                color: COLOR,
                intensity: 0.167,
                rotation: new THREE.Euler(Math.PI / 10, Math.PI / 3, 0, 'YXZ')
            },
            backlight: {
                color: COLOR,
                intensity: 0.11,
                rotation: new THREE.Euler(Math.PI / 8, -Math.PI / 2, 0, 'YXZ')
            }
        };
    }

    public nextMode(): DayMode {
        return DayMode.DAY;
    }

}


// Assign modes

(DayMode.DAY as any) = new DayModeDay();
(DayMode.NIGHT as any) = new DayModeNight();

import * as THREE from 'three';

import { DayModeNotifiable } from '../../day-mode/day-mode-notifiable';
import { DayMode } from '../../day-mode/day-mode';

interface GeneralOptions {
    color: number;
    distance: number;
    angle: number;
    exponent: number;
    decay: number;
}

export interface CarHeadlightDayModeOptions {
    intensity: number;
}

export class CarHeadlight extends THREE.SpotLight implements DayModeNotifiable {

    private static generalOptions: GeneralOptions = {
        color: 0xfbf2b5,
        distance: 10,
        angle: Math.PI / 4,
        exponent: 0.6,
        decay: 1.3,
    };

    public constructor() {
        super(
            CarHeadlight.generalOptions.color,
            0x000000,
            CarHeadlight.generalOptions.distance,
            CarHeadlight.generalOptions.angle,
            CarHeadlight.generalOptions.exponent,
            CarHeadlight.generalOptions.decay
        );
    }

    public dayModeChanged(newMode: DayMode): void {
        const OPTIONS = newMode.CAR_HEADLIGHT_OPTIONS;
        this.intensity = OPTIONS.intensity;
    }

}

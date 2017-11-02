import { CarColor, Rgb } from './car-color';

export class CarColorBlue extends CarColor {

    public getRgb(): Rgb {
        return {
            r: 0.1,
            g: 0.1,
            b: 0.9
        };
    }

}

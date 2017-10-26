import { CarColor, Rgb } from './car-color';

export class CarColorGreen extends CarColor {

    public getRgb(): Rgb {
        return {
            r: 0.1,
            g: 0.9,
            b: 0.1
        };
    }

}

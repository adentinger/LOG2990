import { CarColor, Rgb } from './car-color';

export class CarColorRed extends CarColor {

    public getRgb(): Rgb {
        return {
            r: 0.9,
            g: 0.1,
            b: 0.1
        };
    }

}

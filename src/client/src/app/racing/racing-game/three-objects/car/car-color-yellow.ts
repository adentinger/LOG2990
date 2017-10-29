import { CarColor, Rgb } from './car-color';

export class CarColorYellow extends CarColor {

    public getRgb(): Rgb {
        return {
            r: 0.9,
            g: 0.9,
            b: 0.1
        };
    }

}

interface Rgb {
    r: number;
    g: number;
    b: number;
}

export abstract class CarColor {

    public abstract getRgb(): Rgb;

}

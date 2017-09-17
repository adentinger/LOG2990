export class Vector extends Array<number> {

    public get x(): number {
        return this[0];
    }

    public get y(): number {
        return this[1];
    }

    public set x(value: number) {
        this[0] = value;
    }

    public set y(value: number) {
        this[1] = value;
    }
}


export class Point {

    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public equals(that: Point): boolean {
        return this.x === that.x && this.y === that.y;
    }

    public add(that: Point): this {
        this.x += that.x;
        this.y += that.y;
        return this;
    }

}

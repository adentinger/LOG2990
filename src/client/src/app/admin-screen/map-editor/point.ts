export class Point {
    public x: number;
    public y: number;

    constructor(context: CanvasRenderingContext2D, x: number = 0, y: number = 0, radius: number = 10, color: string = 'blue') {
        this.x = x;
        this.y = y;
    }
}

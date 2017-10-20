import { WordPosition } from './word-position';

export class GridFillerWordPlacement {

    public minLength: number;
    public maxLength: number;
    public position: WordPosition;

    constructor(position: WordPosition,
                minLength: number,
                maxLength: number) {
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.position = position;
    }

    public equals(that: GridFillerWordPlacement): boolean {
        return this.minLength === that.minLength &&
               this.maxLength === that.maxLength &&
               this.position.equals(that.position);
    }

}
import { WordPosition } from './word-position';

export class Word {

    public value: string;
    public position: WordPosition;

    constructor(value: string, position: WordPosition) {
        this.value = value;
        this.position = position;
    }

    public equals(that: Word): boolean {
        return this.value === that.value &&
               this.position.equals(that.position);
    }

}

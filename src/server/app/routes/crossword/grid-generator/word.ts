import { WordPosition } from './word-position';

export class Word {
    public value: string;
    public position: WordPosition;
    constructor(value: string) {
        this.value = value;
    }
}

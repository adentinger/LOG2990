import { WordPosition } from './word-position';
import { GridWord } from '../../../../../common/src/crossword/grid-word';

export class Word {

    public value: string;
    public position: WordPosition;

    public static fromGridWord(gridWord: GridWord): Word {
        return null;
    }

    constructor(value: string, position: WordPosition) {
        this.value = value;
        this.position = position;
    }

    public equals(that: Word): boolean {
        return this.value === that.value &&
               this.position.equals(that.position);
    }

}

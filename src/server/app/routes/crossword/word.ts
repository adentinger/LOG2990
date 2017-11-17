import { WordPosition } from './word-position';
import { GridWord } from '../../../../common/src/crossword/grid-word';

/**
 * @class Word
 * @description This is the representation of a Word that the grid generator uses.
 * The general crossword game uses the GridWord class.
 */
export class Word {

    public value: string;
    public position: WordPosition;

    public static fromGridWord(gridWord: GridWord): Word {
        return new Word(gridWord.string, new WordPosition(gridWord.y, gridWord.x));
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

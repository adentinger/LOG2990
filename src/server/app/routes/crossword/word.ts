import { GridWord } from '../../../../common/src/crossword/grid-word';
import { Player } from './player';
import { Direction } from '../../../../common/src/crossword/crossword-enums';
import { WordPosition } from './word-position';

/**
 * @class Word
 * @description This is the representation of a Word that the grid generator uses.
 * The general crossword game uses the GridWord class.
 */
export class Word {

    public value: string;
    public position: WordPosition;
    public direction: Direction;
    public owner: Player;

    public static fromGridWord(gridWord: GridWord): Word {
        return new Word(gridWord.string, new WordPosition(gridWord.y, gridWord.x), gridWord.direction);
    }

    constructor(value: string, position: WordPosition, direction: Direction, owner = Player.NO_PLAYER) {
        this.value = value;
        this.position = position;
    }

    public equals(that: Word): boolean {
        return this.value === that.value &&
               this.position.equals(that.position) &&
               this.direction === that.direction &&
               this.owner === that.owner;
    }

}

import { Direction } from './crossword-enums';

export class SelectedWord {

    public direction: Direction;
    public index: number;

    constructor(direction: Direction = 0, index: number = -1) {
        this.direction = direction;
        this.index = index;
    }

}

import { Direction } from './crossword-enums';

export class SelectedWord {
    public direction: Direction;
    public index: number;
    constructor() {
        this.direction = 0;
        this.index = -1;
    }
}

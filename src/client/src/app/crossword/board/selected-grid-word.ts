import { Direction } from '../../../../../common/src/crossword/crossword-enums';

export interface WordByIdAndDirection {
    id: number;
    direction: Direction;
}

export class SelectedGridWord {
    constructor(public player: WordByIdAndDirection,
                public opponent: WordByIdAndDirection) {}
}

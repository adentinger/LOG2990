import { Direction, Owner } from './crossword-enums';

export interface GridWord {
    y: number;
    x: number;
    length: number;
    direction: Direction;
    owner: Owner;
    string: string;
}

import { Direction, Owner } from './crossword-enums';

export interface GridWord {
    id: number;
    y: number;
    x: number;
    length: number;
    direction: Direction;
    owner: Owner;
    string: string;
}

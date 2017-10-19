import { Direction, Owner } from './crossword-enums';

export class GridWord {
    public y: number;
    public x: number;
    public length: number;
    public direction: Direction;
    public owner: Owner;
    public string: string;
}

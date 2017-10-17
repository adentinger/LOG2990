import { Word } from './word';

export enum Difficulty {easy, normal, hard}

export class Grid {
    public across: Word[] = [];
    public vertical: Word[] = [];
    public difficulty: Difficulty;

    constructor (difficulty: Difficulty) {
        this.difficulty = difficulty;
    }
}

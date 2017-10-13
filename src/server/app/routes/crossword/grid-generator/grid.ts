import { Word } from './word';

enum Difficulty {easy, normal, hard}


export class Grid {
    public gridForAcross: Word[] = [];
    public gridForVertical: Word[] = [];
    public difficulty: Difficulty;

    constructor (difficulty: Difficulty) {
        this.difficulty = difficulty;
    }
}

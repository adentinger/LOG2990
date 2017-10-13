import { Word } from './word';

enum difficulty {easy, medium, hard}


export class Grid {
    public gridForAcross: Word[] = [];
    public gridForVertical: Word[] = [];
    public difficulty: difficulty;

    constructor (difficulty: difficulty) {
        this.difficulty = difficulty;
    }
}

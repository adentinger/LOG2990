import { Grid, Difficulty } from './grid';

export class GridGenerator {
    public difficulty: Difficulty;

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    public async gridGeneration(): Promise<Grid> {
        return null;
    }

}

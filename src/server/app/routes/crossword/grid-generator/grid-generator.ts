import { Grid, Difficulty } from './grid';

export class GridGenerator {

    private static readonly INSTANCE = new GridGenerator();

    private constructor() {}

    public static getInstance(): GridGenerator {
        return GridGenerator.INSTANCE;
    }

    public async gridGeneration(difficulty: Difficulty): Promise<Grid> {
        return null;
    }

}

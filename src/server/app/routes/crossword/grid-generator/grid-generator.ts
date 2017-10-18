import { Grid } from './grid';
import { Difficulty } from './difficulty';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { GridFillerThirdSection } from './grid-filler-third-section';
import { GridFillerFourthSection } from './grid-filler-fourth-section';

export class GridGenerator {

    private static readonly INSTANCE = new GridGenerator();

    private constructor() {}

    public static getInstance(): GridGenerator {
        return GridGenerator.INSTANCE;
    }

    public async gridGeneration(difficulty: Difficulty): Promise<Grid> {
        const GRID = new Grid();
        const FILLER_FIRST_SECTION  = new GridFillerFirstSection(difficulty);
        const FILLER_SECOND_SECTION = new GridFillerSecondSection(difficulty);
        const FILLER_THIRD_SECTION  = new GridFillerThirdSection(difficulty);
        const FILLER_FOURTH_SECTION = new GridFillerFourthSection(difficulty);
        await GRID.fillUsing(FILLER_FIRST_SECTION);
        await GRID.fillUsing(FILLER_SECOND_SECTION);
        await GRID.fillUsing(FILLER_THIRD_SECTION);
        await GRID.fillUsing(FILLER_FOURTH_SECTION);
        return GRID;
    }

}

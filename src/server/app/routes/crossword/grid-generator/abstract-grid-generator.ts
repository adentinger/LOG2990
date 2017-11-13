import { Grid } from './grid';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { GridFillerThirdSection } from './grid-filler-third-section';
import { GridFillerFourthSection } from './grid-filler-fourth-section';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';
import { Logger } from '../../../../../common/src/logger';
import { GridWord } from '../../../../../common/src/crossword/grid-word';

const logger = Logger.getLogger();

export abstract class AbstractGridGenerator {
    private static count = 0;

    protected constructor() { }

    public async gridGeneration(wordsToInclude: GridWord[], suggestionsGetter: AbstractWordSuggestionsGetter): Promise<Grid> {
        const GRID = new Grid();
        const FILLER_FIRST_SECTION = new GridFillerFirstSection(suggestionsGetter);
        const FILLER_SECOND_SECTION = new GridFillerSecondSection(suggestionsGetter);
        const FILLER_THIRD_SECTION = new GridFillerThirdSection(suggestionsGetter);
        const FILLER_FOURTH_SECTION = new GridFillerFourthSection(suggestionsGetter);
        await GRID.fillUsing(FILLER_FIRST_SECTION);
        await GRID.fillUsing(FILLER_SECOND_SECTION);
        await GRID.fillUsing(FILLER_THIRD_SECTION);
        await GRID.fillUsing(FILLER_FOURTH_SECTION);
        logger.log('count: %d', ++AbstractGridGenerator.count);
        logger.log(GRID.toString());
        return GRID;
    }
}

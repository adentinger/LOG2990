import { Grid } from './grid';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { GridFillerThirdSection } from './grid-filler-third-section';
import { GridFillerFourthSection } from './grid-filler-fourth-section';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';
import { Word } from './word';

export abstract class AbstractGridGenerator {

    private latestGeneration: Promise<Grid> = null;

    protected constructor() { }

    protected gridGenerationBase(wordsToInclude: Word[], suggestionsGetter: AbstractWordSuggestionsGetter): Promise<Grid> {

        this.latestGeneration = new Promise((resolve, reject) => {
            const GRID = new Grid();

            const FILLER_FIRST_SECTION = new GridFillerFirstSection(suggestionsGetter);
            const FILLER_SECOND_SECTION = new GridFillerSecondSection(suggestionsGetter);
            const FILLER_THIRD_SECTION = new GridFillerThirdSection(suggestionsGetter);
            const FILLER_FOURTH_SECTION = new GridFillerFourthSection(suggestionsGetter);

            GRID.fillUsing(FILLER_FIRST_SECTION)
            .then(() => {
                GRID.fillUsing(FILLER_SECOND_SECTION);
            }).then(() => {
                GRID.fillUsing(FILLER_THIRD_SECTION);
            }).then(() => {
                GRID.fillUsing(FILLER_FOURTH_SECTION);
            });

            return GRID;
        });

        return this.latestGeneration;
    }

    protected cancelLatestGeneration(): Promise<void> {
        return this.latestGeneration.catch(() => { return; }).then(() => { return; });
    }

}

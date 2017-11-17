import { Grid } from './grid';
import { GridFiller } from './grid-filler';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { GridFillerThirdSection } from './grid-filler-third-section';
import { GridFillerFourthSection } from './grid-filler-fourth-section';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';
import { Word } from './word';

interface GenerationData {
    grid: Grid;
    fillers: GridFiller[];
    promise: Promise<Grid>;
}

export abstract class AbstractGridGenerator {

    private latestGeneration: GenerationData = null;

    protected constructor() { }

    protected gridGenerationBase(wordsToInclude: Word[], suggestionsGetter: AbstractWordSuggestionsGetter): Promise<Grid> {
        this.latestGeneration = this.startGeneration(wordsToInclude, suggestionsGetter);
        return this.latestGeneration.promise;
    }

    private startGeneration(wordsToInclude: Word[], suggestionsGetter: AbstractWordSuggestionsGetter): GenerationData {
        const generationData: GenerationData = {
            grid: null,
            fillers: null,
            promise: null
        };
        generationData.promise = new Promise(async (resolve, reject) => {
            generationData.grid = new Grid();
            generationData.fillers = [
                new GridFillerFirstSection (suggestionsGetter),
                new GridFillerSecondSection(suggestionsGetter),
                new GridFillerThirdSection (suggestionsGetter),
                new GridFillerFourthSection(suggestionsGetter)
            ];

            for (let i = 0; i < generationData.fillers.length; ++i) {
                const filler = generationData.fillers[i];
                await generationData.grid.fillUsing(filler);
            }

            return generationData.grid;
        });

        return generationData;
    }

    protected cancelLatestGeneration(): Promise<void> {
        this.latestGeneration.fillers.forEach(filler => filler.cancelFilling());
        return this.latestGeneration.promise
            .then (() => { return; })
            .catch(() => { return; });
    }

}

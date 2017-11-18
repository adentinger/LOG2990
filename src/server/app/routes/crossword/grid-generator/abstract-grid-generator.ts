import { Grid } from './grid';
import { GridFiller } from './grid-filler';
import { GridFillerContainer } from './grid-filler-container';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';
import { Word } from '../word';

interface GenerationData {
    grid: Grid;
    filler: GridFiller;
    promise: Promise<Grid>;
}

export abstract class AbstractGridGenerator {

    private dataOfLatestGeneration: GenerationData;

    protected get latestGeneration(): Promise<Grid> {
        return this.dataOfLatestGeneration.promise;
    }

    protected constructor() {
        const EMPTY_GRID = new Grid();
        this.dataOfLatestGeneration = {
            filler: null,
            grid: EMPTY_GRID,
            promise: Promise.resolve(EMPTY_GRID)
        };
    }

    protected gridGenerationBase(wordsToInclude: Word[], suggestionsGetter: AbstractWordSuggestionsGetter): Promise<Grid> {
        this.dataOfLatestGeneration = this.startGeneration(wordsToInclude, suggestionsGetter);
        return this.dataOfLatestGeneration.promise;
    }

    private startGeneration(wordsToInclude: Word[], suggestionsGetter: AbstractWordSuggestionsGetter): GenerationData {
        const generationData: GenerationData = {
            grid: null,
            filler: null,
            promise: null
        };
        generationData.promise = new Promise(async (resolve, reject) => {
            generationData.grid = new Grid();
            generationData.filler = new GridFillerContainer(suggestionsGetter);
            await generationData.grid.fillUsing(generationData.filler);
            resolve(generationData.grid);
        });

        return generationData;
    }

    protected cancelLatestGeneration(): Promise<void> {
        this.dataOfLatestGeneration.filler.cancelFilling();
        return this.dataOfLatestGeneration.promise
            .then (() => { return; })
            .catch(() => { return; });
    }

}
